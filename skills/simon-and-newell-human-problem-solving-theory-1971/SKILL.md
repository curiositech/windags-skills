---
license: Apache-2.0
name: simon-and-newell-human-problem-solving-theory-1971
description: Foundational cognitive science theory of human problem-solving through heuristic search in problem spaces
category: Research & Academic
tags:
  - problem-solving
  - cognitive-science
  - search
  - heuristics
  - theory
---

# SKILL: Human Problem Solving Theory

## Core Insight
Intelligence = examining the right 50 nodes out of 10^100, not searching faster through millions. This skill provides L3 decision frameworks for when and how to apply selective search principles to agent systems.

## DECISION POINTS

### Agent Performance Diagnosis
```
IF agent examines >1000 nodes for problems with <10^6 states
├── THEN selectivity problem
├── Fix: Extract structural information for heuristics
└── NOT: Add more compute power

IF same problem solved easily with different representation
├── THEN problem space construction issue  
├── Fix: Test alternative state representations
└── NOT: Optimize search within current representation

IF agent succeeds on similar problems but fails here
├── Check: Does current problem space expose task structure?
├── If NO: Reconstruct problem space
└── If YES: Refine heuristics for this structure

IF resource usage grows unbounded
├── THEN strategy exceeds architectural constraints
├── Fix: Switch to constraint-compatible strategy
└── Example: Progressive deepening for limited memory
```

### Search Strategy Selection
```
Working Memory: LIMITED + Backtracking: CHEAP
└── Use progressive deepening (depth-first with backtrack)

Working Memory: ABUNDANT + State comparison: NEEDED  
└── Use scan-and-search (breadth-first)

Task Structure Assessment:
├── Clear goal state + Measurable progress → Means-ends analysis
├── Hard constraints + Dependencies → Most-constrained-first
├── Recognizable patterns + Action opportunities → Opportunistic planning
└── Multiple valid paths + Resource limits → Constraint satisfaction
```

### Heuristic Design Decision Tree
```
Task has well-defined goal state?
├── YES: Extract differences between current and goal
│   ├── Differences are measurable? → Means-ends analysis
│   └── Differences are qualitative? → Pattern-based selection
└── NO: Use structural constraints
    ├── Hard constraints exist? → Most-constrained-first
    ├── Known patterns exist? → Production rules (condition→action)
    └── Multiple operators available? → Extract structural ranking info
```

## FAILURE MODES

### Speed Fallacy Anti-Pattern
**Detection Rule**: If solution involves "faster hardware" or "more parallelism" for search problems
**Symptoms**: Agent examines thousands of nodes, performance scales with compute
**Diagnosis**: Missing selectivity through structural information extraction
**Fix**: Analyze task structure for exploitable patterns, constraints, or goal-distance measures

### Universal Strategy Trap
**Detection Rule**: If same search approach (usually means-ends) applied to all problems
**Symptoms**: Works on clear-goal problems, fails on constraint satisfaction or opportunistic tasks  
**Diagnosis**: Strategy-task structure mismatch
**Fix**: Match search pattern to task structure—means-ends for goal reduction, constraint propagation for CSPs, pattern recognition for opportunistic planning

### Representation Blindness
**Detection Rule**: If optimization effort goes to search algorithms before testing representations
**Symptoms**: Extensive tuning yields marginal gains, "obviously easy" problems remain hard
**Diagnosis**: Wrong problem space for task structure
**Fix**: Test 2-3 alternative state representations before optimizing search within any one

### Architecture-Strategy Mismatch  
**Detection Rule**: If strategy requires more working memory than system provides
**Symptoms**: Thrashing, exponential memory growth, inability to backtrack effectively
**Diagnosis**: Importing unlimited-memory strategies to constrained systems
**Fix**: Use progressive deepening for memory-limited, scan-and-search only when memory permits full state tracking

### Construction Neglect Pattern
**Detection Rule**: If problem space treated as "given" without explicit construction phase
**Symptoms**: Agent can't initialize on new tasks, representation seems arbitrary
**Diagnosis**: No systematic problem space construction from task environment
**Fix**: Allocate design effort to representation selection proportional to search difficulty

## WORKED EXAMPLES

### Example 1: Cryptarithmetic Problem (SEND + MORE = MONEY)
**Novice Approach**: 
- Problem space: All possible letter-to-digit assignments (10! = 3.6M states)
- Search: Try random assignments, check arithmetic
- Result: Examines thousands of invalid states

**Expert Application**:
- **Problem space construction**: States are partial assignments of letters to digits with constraints
- **Structural information extraction**: 
  - Column constraints (C1 + C2 + carry_in = result + 10*carry_out)
  - Most-constrained variable first (S and M have only 2 valid values each)
  - Constraint propagation (if S=9, then M=1, eliminating other M values)
- **Decision point**: Use constraint satisfaction, not means-ends (no single goal state)
- **Search strategy**: Most-constrained-first with forward checking
- **Result**: Solution in 50-100 nodes by eliminating impossible branches early

**Key Insight**: Same task, different problem space. Constraint-based representation exposes structure that assignment-enumeration hides.

### Example 2: Tower of Hanoi (5 disks)
**Representation Comparison**:

**Poor representation**: States as disk positions [(disk1_peg, disk2_peg, ...)]
- 3^5 = 243 possible states, most invalid (large on small)
- No structural guidance for move selection
- Search examines invalid configurations

**Good representation**: States as peg configurations with implicit size ordering
- Only ~100 valid states (legal configurations)
- Move constraints embedded in representation
- Goal-distance heuristic: count disks not on target peg

**Decision Logic Applied**:
1. **Task structure**: Clear goal state (all disks on peg 3), subgoal decomposition possible
2. **Strategy selection**: Means-ends analysis appropriate (goal-directed with measurable progress)
3. **Heuristic design**: Difference = number of disks not on target peg
4. **Architecture match**: Recursive subgoaling fits human memory limits through problem decomposition

**Search Performance**: Expert finds solution in 31 moves (optimal) by examining ~50 nodes. Poor representation might examine 1000+ nodes and find suboptimal 100-move solution.

### Example 3: Medical Diagnosis Task
**Task Environment**: Patient symptoms → disease identification → treatment

**Problem Space Construction Decision**:
- **Option A**: States = all possible diseases, operators = diagnostic tests
- **Option B**: States = symptom clusters, operators = differential diagnosis rules
- **Option C**: States = causal pathways, operators = evidence accumulation

**Expert Choice**: Hybrid approach
- **Initial search**: Pattern recognition (symptoms → candidate diseases)
- **Refinement search**: Most-constrained-first (tests that differentiate top candidates)
- **Architecture consideration**: Use production rules for fast pattern matching, deeper search only for ambiguous cases

**Decision Framework Applied**:
1. **Recognizable patterns exist** → Use opportunistic planning (symptom patterns trigger disease hypotheses)
2. **Hard constraints exist** → Most-constrained-first for disambiguation (tests that rule out maximum candidates)
3. **Memory limits binding** → Progressive deepening with early pattern termination

## QUALITY GATES

- [ ] Problem space representation chosen explicitly (not assumed/inherited)
- [ ] Search strategy matches task structure (goal-directed vs. constraint-based vs. opportunistic)
- [ ] Heuristics extract information from problem structure (not generic distance metrics)
- [ ] Architecture constraints respected (memory limits, processing speed, backtracking costs)
- [ ] Selectivity demonstrated (examines <1% of theoretical search space for non-trivial problems)
- [ ] Failure modes have detection rules (can diagnose wrong representation vs. weak heuristics)
- [ ] Alternative representations tested when performance poor
- [ ] Structural information sources identified (constraints, patterns, goal-distances, dependencies)
- [ ] Strategy switches based on task structure assessment
- [ ] Problem space construction process explicit (not ad-hoc representation choice)

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- **Pure optimization problems**: Use mathematical optimization theory instead
- **Machine learning model selection**: Use statistical learning theory
- **Parallel algorithm design**: Use concurrent systems theory  
- **Database query optimization**: Use relational algebra optimization
- **Real-time control systems**: Use control theory

**Delegation Rules**:
- For numerical optimization with continuous variables → Use `convex-optimization` or `metaheuristics`
- For pattern recognition with training data → Use `machine-learning-fundamentals`
- For concurrent search across multiple agents → Use `distributed-systems-coordination`
- For problems with probabilistic uncertainty → Use `decision-theory-under-uncertainty`
- For reactive systems with timing constraints → Use `real-time-systems-design`

**Boundary Markers**:
- Problem has discrete states and operators (not continuous optimization)
- Search space is large but finite (not infinite optimization landscapes)
- Solution quality depends on path/sequence (not just final state)
- Human-level intelligence provides useful benchmarks (not superhuman performance requirements)