# Manager-Driven Team Dynamics

Use this file when the active working set should change round by round.

## The concept

A real team topology is not "repeat the same DAG until an evaluator is happy."

It has:

- a manager or lead who sees the evolving state
- a catalog of roles with capabilities
- dynamic assignment per round
- optional creation of new roles
- manager-decided shipping or continuation

That is exactly how the current repo runtime describes `packages/core/src/topologies/team.ts`.

## Why this matters

### Fixed review loops are not teams

If the structure is always:

- author writes
- reviewer checks
- author revises

then the right planning object is a workflow.

### Teams exist when role participation changes

You need team semantics when:

- some roles are idle in one round and active in the next
- the manager decides who should work now
- the manager can decide the current team is missing a role
- final ship/no-ship is an overall judgment, not just a gate verdict

## What the research says

### Stone and Veloso, 1999

Their real-time teamwork work describes:

- a flexible team agent structure
- roles defined inside formations
- homogeneous agents switching roles
- formations changing dynamically based on runtime triggers

That is much closer to manager-driven team rounds than to "inner DAG plus evaluator."

### Dynamic role discovery and assignment, 2023

The DRDA work argues that:

- predefined roles often stop fitting as task and team dynamics change
- role assignment should be dynamic
- multiple agents may occupy the same role at one time and different roles later
- role changes should be stabilized rather than thrashing every step

## Planning rules

1. Define the manager's view of team state.
2. Define roles by capability envelope, not by one permanent task.
3. Require a per-round assignment schema.
4. Define when new roles may be introduced.
5. Define manager exit conditions and hard limits.

## Sources

- Peter Stone, Manuela Veloso, "Task Decomposition, Dynamic Role Assignment, and Low-Bandwidth Communication for Real-Time Strategic Teamwork", Artificial Intelligence 110(2), 1999. Public abstract: https://www.cs.utexas.edu/~pstone/Papers/99aij/teamwork.html
- Yu Xia, Junwu Zhu, Liucun Zhu, "Dynamic role discovery and assignment in multi-agent task decomposition", Complex & Intelligent Systems 9, 2023. https://doi.org/10.1007/s40747-023-01071-x
- Repo runtime source: `packages/core/src/topologies/team.ts`
