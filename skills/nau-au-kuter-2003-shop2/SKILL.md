---
license: Apache-2.0
name: nau-au-kuter-2003-shop2
description: SHOP2 hierarchical task network planner for automated planning through recursive task decomposition
category: Research & Academic
tags:
  - htn-planning
  - shop2
  - task-decomposition
  - automated-planning
  - hierarchical
---

# SKILL: HTN Planning and Task Decomposition

## Core Mental Models

### 1. Ordered Decomposition Eliminates Uncertainty
Plan tasks in execution order to transform exponential state-space reasoning into linear complexity. With known current state, you can trivially call external functions and make decisions based on actual conditions, not possibility spaces.

### 2. Methods Encode Expert Procedures
Represent domain knowledge as methods that capture how experts solve problems. A method says "to accomplish X in situation Y, do subtasks A, B, C in that order"—transforming search problems into procedure selection.

### 3. Hierarchical Abstraction Drives Efficiency
Work at the highest abstraction level possible. Planning "transport-person" is tractable; planning 200 atomic movements from first principles is not. Decompose only when necessary for current execution.

## Decision Points

### Task Decomposition Strategy Selection
```
IF domain has established expert procedures
  → Encode as HTN methods with preconditions
  → Use sort-by heuristics for method selection
ELSE IF domain requires learning/discovery
  → Start with learned policies
  → Migrate successful patterns to methods over time
ELSE IF procedures vary significantly by context
  → Use conditional methods with situation-specific preconditions
  → Maintain method libraries organized by context types
```

### State Management Architecture Choice
```
IF execution order determinable at planning time
  → Use ordered decomposition for simple state reasoning
  → Maintain definite current state, not possibility sets
ELSE IF tasks genuinely independent and parallelizable
  → Use partial-order planning
  → Accept cost of tracking state uncertainty
ELSE IF complex reasoning needed (temporal, probabilistic)
  → First try state augmentation (add timestamps, probabilities)
  → Only build specialized reasoning engines if augmentation insufficient
```

### Planning vs. Execution Integration
```
IF domain description differs from execution environment
  → Maintain automated translation layer
  → Validate translation with small test cases
ELSE IF execution failures occur frequently
  → Check specification-vs-execution gap first
  → Verify operator effects match actual execution results
ELSE IF performance inadequate
  → Add domain-specific methods to baseline capabilities
  → Profile for exponential search patterns
```

### Knowledge Acquisition Strategy
```
IF domain experts exist and procedures are established
  → Hand-code methods encoding expert knowledge
  → Accept "cheating" vs pure learning for 2x performance gain
ELSE IF domain exploratory or procedures unknown
  → Use automated learning with PDDL operators
  → Plan to migrate learned patterns to explicit methods
ELSE IF mixed domain (some known procedures, some discovery)
  → Hybrid: methods for known procedures, learning for novel situations
  → Automated promotion of successful learned patterns to methods
```

## Failure Modes

### Domain Description Bug (Symptom → Diagnosis → Fix)
**Detection Rule**: Planner generates syntactically valid plans that fail during execution
**Symptom**: Plans look correct, execute incorrectly, consistent failure pattern across similar problems
**Diagnosis**: Hand-written HTN methods contain logical errors—wrong preconditions, incorrect effect specifications, missing edge cases
**Fix**: Systematic testing of methods on small instances; automated validation tools; pair programming for method development

### Specification-Execution Gap (Symptom → Diagnosis → Fix)  
**Detection Rule**: Mysterious planning failures on problems that should be solvable
**Symptom**: PDDL operators work in other planners but SHOP2 translation produces poor performance or invalid plans
**Diagnosis**: Gap between what operators specify and how tasks are actually accomplished; missing procedural knowledge
**Fix**: Manual enhancement of auto-translated domains; encode expert procedures as methods; validate translation with domain experts

### Search Space Explosion (Symptom → Diagnosis → Fix)
**Detection Rule**: Planning time grows exponentially with problem size; solver times out on medium instances
**Symptom**: Planner explores vast numbers of decompositions; thrashes between similar partial plans; memory usage grows uncontrollably
**Diagnosis**: Missing domain-specific methods cause fall-back to inefficient search; no heuristic guidance for method selection
**Fix**: Add methods that encode standard procedures; implement sort-by heuristics; profile search patterns to identify missing knowledge

### Method Conflict Deadlock (Symptom → Diagnosis → Fix)
**Detection Rule**: Planner backtracks excessively between competing valid decompositions
**Symptom**: Multiple methods applicable to same task; solver oscillates between options; search depth grows without progress
**Diagnosis**: Methods lack sufficient specificity in preconditions; competing heuristics without clear priority ordering
**Fix**: Refine method preconditions for better context sensitivity; implement preference ordering; add meta-methods for method selection

### Premature Optimization Trap (Symptom → Diagnosis → Fix)
**Detection Rule**: Complex optimization produces worse results than simple heuristic approaches
**Symptom**: Sophisticated search algorithms underperform greedy method selection; optimal planning fails on problems simple heuristics solve
**Diagnosis**: Over-investment in search sophistication without adequate domain knowledge; treating domain expertise as "cheating"
**Fix**: Encode domain heuristics first; start with simple greedy search; add sophistication only when domain knowledge insufficient

## Worked Examples

### Example 1: Agent Orchestration Architecture Design

**Scenario**: Design coordination system for multi-agent document generation (research, outline, draft, review, edit).

**Novice Approach**: Create agents for each subtask, use message passing for coordination, track all possible states.
- **What They Miss**: Exponential state explosion from tracking all agent combinations; no procedural knowledge for standard workflows

**Expert HTN Analysis**:
1. **Identify Natural Decomposition**: Document-generation follows established procedure: research → outline → draft → review → edit
2. **Design State Representation**: Current document state, active agent, completion status per section
3. **Encode Methods**:
   ```
   Method: generate-document
   Preconditions: topic assigned, no existing document
   Decomposition: research-topic, create-outline, draft-sections, review-draft, finalize-document
   ```
4. **Add Concurrency via State Augmentation**: Section ownership, parallel drafting with merge coordination
5. **Handle Failures**: Backtrack methods (review → redraft), not full state search

**Key Decision**: Use ordered decomposition with known handoff points rather than tracking all possible agent interaction states. Reduces complexity from O(n!) to O(n).

**Trade-off Navigated**: Accept constraint of sequential high-level phases (can't start drafting before research) to gain tractable coordination. Allow parallelism within phases via state augmentation.

### Example 2: Task Planning with Resource Constraints

**Scenario**: Plan multi-day conference setup with limited staff, equipment conflicts, vendor dependencies.

**Novice Approach**: Model as constraint satisfaction problem with all resources, times, dependencies as variables.
- **What They Miss**: No procedural knowledge for conference setup; treating as pure optimization ignores expert experience

**Expert HTN Analysis**:
1. **Encode Expert Procedures**: Conference planners follow standard sequences—venue setup before catering, AV testing before presentations
2. **State Augmentation for Resources**: Add resource availability, read-time/write-time to handle conflicts
3. **Method Design**:
   ```
   Method: setup-conference-day
   Preconditions: venue confirmed, staff assigned, equipment list finalized
   Decomposition: setup-venue, test-av-systems, prepare-catering, brief-staff
   Sort-by: critical-path-first (AV failures block everything)
   ```
4. **Handle Uncertainty**: Methods with conditional branches for common contingencies (weather, equipment failure)
5. **Resource Conflict Resolution**: Check resource state in method preconditions, not separate constraint engine

**Key Decision**: Encode conference management expertise as methods rather than discovering optimal schedules through search. Expert procedures handle 95% of situations; search only needed for novel constraints.

**Alternative Considered**: Pure optimization approach would find "optimal" schedules but miss critical dependencies that conference experts know (e.g., catering setup must happen after final headcount, not at optimal resource utilization time).

## Quality Gates

**Task Planning Completeness:**
- [ ] All high-level goals decompose to executable primitives
- [ ] Every method has well-defined preconditions and effects
- [ ] State representation captures all information needed for method selection
- [ ] No circular dependencies in method decomposition hierarchy
- [ ] Failure cases have explicit recovery methods or backtrack points

**Domain Knowledge Coverage:**
- [ ] Standard expert procedures encoded as methods (not rediscovered via search)
- [ ] Heuristics implemented for common decision points (sort-by clauses)
- [ ] Edge cases and exceptions handled with conditional methods
- [ ] Resource constraints integrated into state representation
- [ ] Translation layer validated between specification and execution

**Performance and Scalability:**
- [ ] Planning time scales linearly with problem size (not exponentially)
- [ ] Method selection uses domain heuristics, not exhaustive search
- [ ] State representation avoids tracking unnecessary possibility spaces
- [ ] Concurrent activities handled via state augmentation, not temporal logic
- [ ] Backtracking bounded by method hierarchy depth, not search space size

**Correctness and Robustness:**
- [ ] Generated plans execute successfully in target environment
- [ ] Method preconditions match actual execution conditions
- [ ] State updates correctly reflect execution results
- [ ] Error handling preserves state consistency
- [ ] Domain description bugs caught before deployment (testing on small instances)

## NOT-FOR Boundaries

**Don't Use HTN Planning For:**
- **Pure Optimization Problems**: Use mathematical optimization for minimizing cost/time with well-defined objective functions
- **Reactive/Real-Time Control**: Use control systems for continuous feedback loops and millisecond response requirements
- **Learning Novel Procedures**: Use reinforcement learning when domain procedures unknown and must be discovered
- **Simple Sequential Tasks**: Use basic scripting for fixed sequences without conditional logic or failure recovery
- **Pure Search Problems**: Use constraint satisfaction or graph search for problems without procedural structure

**Delegate Instead:**
- **For numerical optimization** → Use operations research methods or mathematical programming
- **For real-time reactive control** → Use PID controllers or model-predictive control
- **For discovering new strategies** → Use reinforcement learning or evolutionary algorithms
- **For simple automation** → Use workflow engines or basic scripting
- **For constraint satisfaction** → Use SAT/CSP solvers when no procedural knowledge exists

**HTN Is For:** Complex tasks with established procedures, where expert knowledge exists about how to accomplish goals, and where the challenge is selecting and orchestrating appropriate methods rather than discovering optimal solutions from first principles.