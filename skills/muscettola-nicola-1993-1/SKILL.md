---
name: muscettola-nicola-1993-1
description: 'license: Apache-2.0 NOT for unrelated tasks outside this domain.'
license: Apache-2.0
metadata:
  mutationPolicy: skip
  tags:
  - imported
  - needs-review
  provenance:
    kind: imported
    source: legacy-recovery
---
# SKILL.md: HSTS — Integrated Planning & Scheduling

license: Apache-2.0
```yaml
name: hsts-integrated-planning-scheduling
version: 1.0.0
description: >
  Wisdom from Muscettola's HSTS framework for building intelligent systems
  that unify planning (what to do) and scheduling (when/how to do it).
  Activates when designing constraint-based agents, solving resource allocation
  problems, building robust execution systems, or reasoning about commitment
  under uncertainty.
activation_triggers:
  - planning AND scheduling in same problem
  - resource contention / allocation conflicts
  - temporal reasoning / constraint networks
  - robust execution / plan flexibility
  - combinatorial search with bottlenecks
  - state variable modeling for complex domains
  - "brittle plan" / replanning overhead complaints
  - multi-subsystem coordination problems
```

---

## When to Use This Skill

Load this skill when the problem involves **any of these signatures**:

| Situation | Signal Phrases |
|-----------|----------------|
| Designing an agent that must both decide *what* to do and *when* to do it | "planning and scheduling", "task allocation over time" |
| Plans that break whenever reality deviates slightly | "brittle", "replanning constantly", "nominal plan fails" |
| Search that explores too many options before finding feasibility | "combinatorial explosion", "too many combinations" |
| Resource conflicts across concurrent activities | "contention", "bottleneck", "resource oversubscription" |
| Complex domain with multiple interacting subsystems | "subsystem coordination", "state interdependencies" |
| Need to balance flexibility at execution time vs. commitment at plan time | "flexible execution", "degrees of freedom", "commitment" |
| Encoding expert domain knowledge as constraints | "domain rules", "compatibility", "causal knowledge" |

**This skill is NOT primarily about**: classical STRIPS planning, pure optimization (LP/ILP), real-time scheduling theory, or project management methodologies — though it illuminates all of them.

---

## Core Mental Models

### 1. The Planning/Scheduling Unification
The separation of "what to do" (planning) from "when and with what" (scheduling) is an **artifact of representation**, not a property of the world. When you model a domain as **state variables evolving over continuous time**, both decisions happen simultaneously and inform each other. A causal justification for a goal *is* a temporal constraint. A resource allocation *is* a state transition.

> **Practical implication**: If your architecture has a planner feeding into a scheduler, ask whether the separation is creating coordination debt. The seam may be where bugs live.

### 2. Schedules as Behavioral Envelopes
The goal of scheduling is not to find *the* optimal sequence — it is to find **the most permissive constraint network** consistent with all goals. A good schedule is a *set* of legal behaviors. The executor chooses a path within that set at runtime, absorbing disturbances without replanning.

> **Practical implication**: Preserve temporal flexibility as long as possible. Don't bind a time when an ordering relation suffices. Don't fix a resource assignment when a constraint set suffices.

### 3. Commitment Level as a First-Class Decision
At every problem-solving step, you choose *how much* to commit. The spectrum runs from:
- **Value commitment**: bind variable to exact value (most constraining)
- **Constraint posting**: add ordering or precedence relation (medium)
- **Argument left unbound**: defer choice entirely (least constraining)

Lower commitment during search produces better solutions with less computation. **Commit only when forced or when the information gain justifies it.**

> **Practical implication**: Design your search to ask "what is the minimum commitment needed to make progress?" before making any decision.

### 4. Bottleneck-Centered Probabilistic Focus
Before resolving any disjunction in a constraint network, run **stochastic simulation** over the current partial solution to estimate where conflicts are *most likely* to occur. Focus search effort on the resource-time pair with the highest estimated contention.

> **Practical implication**: Measure before committing. The hardest constraint to satisfy should be addressed first — and "hardest" is an empirical estimate, not an assumption.

### 5. Modularity and Additive Scalability
Complex domains decompose into modules (subsystems, state variables). When heuristics respect module boundaries and model local interactions explicitly, computational cost scales as **sum of parts**, not exponential product. This is architecture-dependent — the framework must make module structure and interaction topology visible.

> **Practical implication**: Define module boundaries *before* building heuristics. Interactions that cross boundaries are the scalability risk; make them explicit and budget for them.

---

## Decision Frameworks

### Framework A: "Should I separate planning and scheduling?"

```
IF the domain has resources with time-varying availability
AND causal goals interact with resource constraints
  → DO NOT separate planning and scheduling
  → Model as unified state variable system
  → LOAD: references/planning-scheduling-unification.md

IF the problem is purely causal (no resource contention)
  → Classical planning may suffice; no unification needed

IF the problem is purely temporal (fixed task structure)
  → Classical scheduling may suffice; no unification needed
```

### Framework B: "How much should I commit right now?"

```
IF a decision is reversible and more information is coming
  → Post constraint, do not bind value
  → Preserve flexibility for executor

IF a decision resolves a high-contention bottleneck
  → Commit now to unblock downstream decisions
  → Use probabilistic estimates to confirm it IS the bottleneck first

IF you are tempted to fix exact times early in search
  → STOP — ask if an ordering relation achieves the same progress
  → LOAD: references/schedules-as-behavioral-envelopes.md
```

### Framework C: "Where should search focus next?"

```
IF constraint network is partially resolved with active disjunctions
  → Run stochastic simulation (sample without resolving disjunctions)
  → Estimate conflict probability per resource-time pair
  → Focus next decision on highest-contention resource

IF search is thrashing (many backtracks, no progress)
  → Likely attacking non-bottleneck variables first
  → Re-estimate contention distribution
  → LOAD: references/bottleneck-centered-probabilistic-search.md

IF domain has strong ordering among constraints
  → Address most constrained first (fail-first principle)
```

### Framework D: "How do I model this domain?"

```
IF domain has objects with internal state that changes over time
  → Model each object as a state variable with legal transition graph

IF domain has shared resources (consumable or reusable)
  → Model resource levels as state variables
  → LOAD: references/resource-modeling-spectrum.md

IF domain knowledge exists as expert rules ("X and Y can't overlap")
  → Encode as compatibility constraints, not as search pruning hacks
  → LOAD: references/compatibility-constraints-as-causal-knowledge.md

IF problem is too large to solve flat
  → Identify natural abstraction hierarchy
  → Solve at coarse level first, refine within committed structure
  → LOAD: references/hierarchical-abstraction-in-problem-solving.md
```

### Framework E: "Why is my constraint system failing?"

```
IF solutions exist but search can't find them
  → Check: are you over-committing early? (commitment level issue)
  → Check: are you ordering search on wrong variables? (bottleneck issue)

IF constraint propagation is slow
  → Check: are constraints encoded at right abstraction level?
  → Check: are module boundaries respected?

IF system produces plans that fail at execution
  → Check: is schedule a nominal trajectory instead of behavioral envelope?
  → LOAD: references/failure-modes-in-constraint-based-systems.md
```

---

## Reference Documents

| File | Load When You Need To... |
|------|--------------------------|
| `references/planning-scheduling-unification.md` | Understand WHY the planning/scheduling boundary is artificial; design unified architectures; explain the HSTS core thesis |
| `references/schedules-as-behavioral-envelopes.md` | Design flexible execution systems; argue against nominal trajectory planning; understand temporal flexibility preservation |
| `references/state-variable-modeling-for-agents.md` | Model a complex domain from scratch; decompose problem into state variables; understand legal transition graphs |
| `references/bottleneck-centered-probabilistic-search.md` | Focus search effort; implement Conflict Partition Scheduling; use stochastic simulation to guide decisions |
| `references/compatibility-constraints-as-causal-knowledge.md` | Encode expert domain knowledge; understand how constraints carry causal semantics; distinguish hard vs. soft constraints |
| `references/hierarchical-abstraction-in-problem-solving.md` | Manage problem complexity through staged commitment; design coarse-to-fine solving strategies |
| `references/failure-modes-in-constraint-based-systems.md` | Diagnose why a planning/scheduling system is failing; understand classical failure patterns HSTS was designed to overcome |
| `references/resource-modeling-spectrum.md` | Choose the right resource representation (binary, numeric, state-based); model consumable vs. reusable resources |
| `references/token-networks-as-executable-knowledge-representation.md` | Understand HSTS's core data structure; implement partial commitment as first-class architecture; understand token semantics |

**Loading heuristic**: Start with `planning-scheduling-unification.md` for conceptual grounding. Load `state-variable-modeling-for-agents.md` when touching domain design. Load `bottleneck-centered-probabilistic-search.md` when touching search strategy. Load `failure-modes-in-constraint-based-systems.md` when debugging.

---

## Anti-Patterns

These are the mistakes HSTS was explicitly designed to prevent:

### ❌ The Nominal Trajectory Trap
Building a scheduler that outputs a single specific sequence of actions with exact times. Any runtime deviation requires full replanning. **Fix**: target behavioral envelopes; output constraint networks, not schedules.

### ❌ Premature Value Commitment
Binding variables to specific values (exact start times, specific resource assignments) before constraints force it. This artificially shrinks the solution space. **Fix**: post the weakest constraint that makes progress.

### ❌ Planning-Then-Scheduling Pipeline
Handing a complete symbolic plan to a scheduler as a fixed input. Resource constraints discovered by the scheduler cannot flow back to revise causal decisions. **Fix**: unify representations so resource and causal reasoning interleave.

### ❌ Flat Search Without Bottleneck Analysis
Treating all disjunctions as equally important and resolving them in arbitrary order. This causes thrashing on easy variables while hard constraints fester. **Fix**: estimate contention distribution before committing; address bottlenecks first.

### ❌ Monolithic Domain Models
Encoding an entire complex domain as one undifferentiated constraint satisfaction problem. Interactions are invisible; heuristics can't be modular; scaling is exponential. **Fix**: decompose into state variable modules; make interaction topology explicit.

### ❌ Hardcoded Pruning as Domain Knowledge
Encoding expert knowledge as ad hoc search pruning rules rather than as formal compatibility constraints. Knowledge becomes invisible, unauditable, and non-reusable. **Fix**: compatibility constraints are first-class objects with causal semantics.

### ❌ Treating Feasibility and Optimality as the Same Problem
Spending search effort optimizing solutions before confirming that the constraint network is satisfiable. **Fix**: first find the most permissive feasible envelope; optimize within it.

---

## Shibboleths

How to tell if someone has genuinely internalized HSTS versus skimmed a summary:

**They get it if they say...**
- "A schedule is a set of behaviors, not a sequence of actions" — and mean it architecturally
- "We should post the ordering constraint, not bind the time" — naturally, during design discussion
- "Where is the bottleneck? Have we measured, or are we guessing?" — before starting search
- "The planning/scheduling separation is a representation choice, not a domain property"
- "Flexibility at execution time is a design goal, not an afterthought"
- "Module interactions are where the complexity lives — we need to make them explicit"

**They're faking it if they say...**
- "We'll plan first, then schedule" — without questioning whether the boundary is costing them
- "We need the optimal schedule" — without asking whether a feasible flexible envelope would be better
- "We'll fix the time early and adjust later if needed" — treating replanning as free
- "The domain is too complex to model formally" — without trying state variable decomposition
- "We pruned those branches because of domain knowledge" — but can't state the knowledge as a constraint
- "HSTS is about spacecraft scheduling" — reducing a general framework to its demonstration domain

**The deepest shibboleth**: Ask them to explain the difference between a *nominal plan* and a *behavioral envelope* and watch whether they give an architectural answer (the envelope is a constraint network; any path through it is legal execution) or a vague one ("the envelope has some slack in it"). The architectural answer shows they've internalized the representation-level insight, not just the intuition.

---

*Last updated: based on Muscettola, N. "HSTS: Integrating Planning and Scheduling" (1994)*