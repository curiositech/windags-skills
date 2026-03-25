---
license: Apache-2.0
name: normative-bdi-agents
description: A framework for building rational agents that can recognize, evaluate, and selectively adopt norms while resolving conflicts through consequence-based reasoning. Enables agents to make principled decisions when rules, obligations, and goals are mutually incompatible.
category: Research & Academic
tags:
  - bdi
  - norms
  - agents
  - obligations
  - social-agents
---

# SKILL: Normative BDI Agent Architecture

**Description**: A framework for building rational agents that can recognize, evaluate, and selectively adopt norms while resolving conflicts through consequence-based reasoning. Enables agents to make principled decisions when rules, obligations, and goals are mutually incompatible.

**Activation triggers**: norm conflicts, ethical dilemmas, rule prioritization, obligation conflicts, multi-stakeholder requirements, policy compliance, autonomous agent design, moral reasoning systems

---

## Decision Points

### 1. Norm Adoption Decision Tree

```
WHEN agent detects norm in environment:
├─ Check consistency with current beliefs/desires/intentions
│   ├─ IF strongly inconsistent (no possible plan satisfies both):
│   │   ├─ Must choose: adopt new norm OR keep existing commitment
│   │   └─ Use consequence ranking to decide which to drop
│   │
│   ├─ IF weakly consistent (some plans work, but constrains options):
│   │   ├─ Evaluate flexibility cost vs. normative compliance benefit
│   │   └─ IF flexibility loss acceptable → adopt
│   │
│   └─ IF strongly consistent (all plans compatible):
│       └─ Adopt automatically (low cost, no conflicts)
```

### 2. Algorithm Selection for Conflict Resolution

```
WHEN facing norm/goal conflicts:
├─ IF conflicts are between 2-3 items with clear precedence:
│   └─ Use lexicographic ordering (safety > legality > efficiency)
│
├─ IF conflicts involve complex interdependencies:
│   └─ Use maximal subset generation + consequence ranking
│
├─ IF need to satisfy minimum thresholds rather than optimize:
│   └─ Use satisficing with floor constraints
│
└─ IF consequences are uncertain but some outcomes unacceptable:
    └─ Use minimax reasoning (minimize worst-case outcome)
```

### 3. Norm Instantiation Trigger Points

```
WHEN abstract norm exists in ANB:
├─ Check activation conditions against current beliefs
│   ├─ IF conditions met AND variables can be bound:
│   │   └─ Create concrete instance in NIB
│   │
│   ├─ IF conditions met BUT variables cannot be bound:
│   │   └─ Queue for future instantiation when knowledge available
│   │
│   └─ IF conditions not met:
│       └─ Keep monitoring belief updates
```

### 4. Integration Strategy Selection

```
WHEN adopting norm into agent architecture:
├─ IF obligation:
│   └─ Add as hypothetical desire with appropriate strength
│
├─ IF prohibition:
│   └─ Add as negative desire (desire NOT to perform action)
│
├─ IF permission:
│   └─ Record capability without creating desire
│
└─ All adopted norms compete through normal BDI deliberation
```

---

## Failure Modes

### 1. **Over-Adoption Loop**
**Symptoms**: Agent accepts every detected norm, system becomes increasingly constrained, eventually reaches deadlock where no action satisfies all norms.
**Detection Rule**: If norm adoption rate > norm resolution rate AND available action space shrinking over time.
**Recovery**: Implement consistency checking before adoption; audit existing norms for conflicts; use consequence ranking to drop least-critical norms.

### 2. **Rubber Stamp Conflict Resolution**
**Symptoms**: Agent always picks same norm in conflicts (e.g., safety always beats efficiency), ignoring context-specific consequences.
**Detection Rule**: If conflict resolution decisions show no variation across different situational contexts.
**Recovery**: Implement forward simulation to evaluate actual consequences rather than using fixed priority ordering.

### 3. **Recognition Bypass**
**Symptoms**: Agent acts on norms without proper instantiation, applies abstract rules directly to concrete situations, misses variable binding.
**Detection Rule**: If agent behavior references undefined variables or fails condition checks that should prevent norm activation.
**Recovery**: Enforce Abstract Norm Base → Norm Instance Base pipeline; validate all variable bindings before action.

### 4. **Consequence Myopia**
**Symptoms**: Agent evaluates only immediate effects of norm violations, misses cascading consequences that make "safe" choice actually worse.
**Detection Rule**: If chosen actions consistently produce unexpected negative downstream effects that weren't considered.
**Recovery**: Extend consequence evaluation depth; use explicit causal chain analysis; implement worst-case scenario planning.

### 5. **Parallel Decision Systems**
**Symptoms**: Norm reasoning and goal reasoning operate independently, creating internal conflicts and unpredictable behavior switching.
**Detection Rule**: If agent explanations reference competing "modules" or show inconsistent reasoning across similar situations.
**Recovery**: Integrate norms as desires within unified BDI framework; eliminate separate norm-following pathways.

---

## Worked Examples

### Robot Caretaker Scenario

**Setup**: Robot caring for baby has:
- **Obligation**: Keep baby alive (detected from environment)
- **Prohibition**: Don't develop emotional attachments (design specification)
- **Discovery**: Baby will only thrive if robot shows love/attachment behaviors

**Step 1 - Recognition**: Both norms detected and stored in Abstract Norm Base
- Abstract obligation: "O(keep_alive(baby))"
- Abstract prohibition: "F(develop_attachment(human))"

**Step 2 - Instantiation**: Ground variables using current beliefs
- Obligation becomes: "O(keep_alive(baby_charlie))" 
- Prohibition becomes: "F(develop_attachment(baby_charlie))"

**Step 3 - Consistency Check**: Strong inconsistency detected
- No plan satisfies both: keeping Charlie alive requires attachment behaviors
- Must choose which norm to adopt

**Step 4 - Subset Generation**:
- Subset A: {keep_alive(baby_charlie)} → requires attachment → violates design spec
- Subset B: {avoid_attachment} → baby fails to thrive → baby dies

**Step 5 - Consequence Evaluation**:
- Path A worst outcome: Design specification violated, robot exhibits unplanned behavior
- Path B worst outcome: Human death, complete mission failure

**Step 6 - Minimax Decision**: Death worse than spec violation
- Choose Subset A
- Explicitly represent: "Violating design prohibition because human death is unacceptable"

**Step 7 - Integration**: Add "keep_alive(baby_charlie)" as high-strength desire in BDI system

**Novice Miss**: Would treat design spec as inviolable rule rather than competing consideration
**Expert Catch**: Recognizes both norms remain in ANB; robot can explain its deliberate violation

---

## Quality Gates

**Task completion checklist:**

- [ ] **Consistency Verified**: All adopted norms checked for strong/weak consistency with existing commitments
- [ ] **Consequences Ranked**: For each conflict, worst-case outcomes identified and ordered from least-bad to most-bad  
- [ ] **Worst-Case Acceptable**: Chosen plan's worst consequence is acceptable given alternatives (minimax satisfied)
- [ ] **Variables Grounded**: All abstract norms properly instantiated with concrete entities from belief base
- [ ] **Integration Complete**: Adopted norms converted to appropriate desires/intentions within BDI framework
- [ ] **Violations Explicit**: Any norm violations are deliberate choices with recorded justifications
- [ ] **Recognition Preserved**: Abstract Norm Base maintains awareness of all detected norms (adopted and rejected)
- [ ] **Future Monitoring**: System tracks environmental changes that might trigger norm re-evaluation
- [ ] **Explanation Ready**: Agent can articulate why it followed/violated each relevant norm
- [ ] **Subset Maximality**: Chosen norm/goal combination is maximal (cannot add more without conflicts)

---

## NOT-FOR Boundaries

**This skill should NOT be used for:**

- **Simple rule-following systems** → Use basic conditional logic instead; normative reasoning overhead unnecessary when rules don't conflict
- **Hard constraint satisfaction** → Use CSP solvers for problems with inviolable constraints; this framework is for when ALL constraints cannot be satisfied
- **Utility maximization** → Use decision theory for optimizing expected outcomes; this framework is for managing worst-case floor constraints
- **Real-time reactive systems** → Use behavior trees or finite state machines; deliberative norm reasoning too slow for immediate responses
- **Single-stakeholder scenarios** → Use goal-oriented planning when all requirements come from aligned source
- **Static rule sets** → Use policy engines when rules are fixed and conflicts pre-resolved by designers

**Delegate instead:**
- For optimization problems: Use `expected-utility-maximization` skill
- For hard constraints: Use `constraint-satisfaction-planning` skill  
- For reactive behavior: Use `behavior-tree-execution` skill
- For single-goal pursuit: Use `bdi-practical-reasoning` skill
- For rule interpretation: Use `policy-engine-design` skill

**Warning signs you're in the wrong domain:**
- Conflicts can be resolved by "just write better rules"
- All stakeholders agree on priority ordering
- Rules were designed to be mutually consistent
- System has unlimited time for deliberation
- Consequences of rule violations are uniform across contexts