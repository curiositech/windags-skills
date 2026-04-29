# Topology Decomposition Playbook

Use this file when you need the shortest path from a natural-language problem to a topology-native plan.

## Core Question Set

Ask these in order:

1. What makes a unit of work eligible to run?
2. Who or what decides what happens next?
3. Is shared state central to the work or just an implementation detail?
4. Are roles fixed, or can the active working set change over time?
5. How does the system know it is done?

## Canonical Mapping

| If the answer is mostly... | Topology |
|----------------------------|----------|
| "Dependencies decide" | `dag` |
| "A reviewer/gate verdict decides" | `workflow` |
| "A manager assigns roles round by round" | manager-driven team |
| "Messages or discoveries make new work appear" | `swarm` |
| "Shared state triggers specialists" | `blackboard` |
| "We need to design the team first" | `team-builder` |
| "One action repeats until a threshold" | `recurring` |

## Breakdown Checklist Per Topology

### DAG

- define nodes
- define edges
- group into waves
- define contracts

### Workflow

- define entry node
- define worker/gate/reviewer roles
- name every verdict
- attach conditional edges
- define back-edge and escalation limits

### Manager-Driven Team

- define objective
- define manager
- define role catalog
- define round decision contract
- define ship rule

### Swarm

- define seed stimulus
- define channel/message taxonomy
- define agent subscribe/publish behavior
- define convergence

### Blackboard

- define board keys
- define initial board state
- define trigger conditions
- define read/write ownership
- define board completion predicate

### Team-Builder

- define unknowns about roles
- define current coverage and gaps
- define threshold for creating/importing skills
- define target topology after staffing

### Recurring

- define repeated node
- define measurable exit condition
- define interval, timeout, and escalation

## Legacy Naming Note

Current WinDAGs runtime and prediction schemas still use `team-loop` in some places.

Use that label only as a compatibility bridge when necessary. The planning concept you should reason about is:

- manager-driven
- role-based
- dynamically delegated
- manager-decided exit

If those properties are absent, it is probably not a team. It is usually a `workflow`.
