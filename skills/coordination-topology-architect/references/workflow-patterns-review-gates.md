# Workflow Patterns, Review Gates, and Rework

Use this file when the work has explicit approvals, rejections, or conditional rework.

## What the primary sources contribute

- The Workflow Patterns work by van der Aalst, ter Hofstede, Kiepuszewski, and Barros established a reusable control-flow vocabulary for process systems, including sequence, AND/XOR/OR branching, joins, deferred choice, discriminators, and arbitrary cycles.
- Their later note "Workflow patterns put into context" reiterates that the patterns are for describing and evaluating real workflow capabilities, not for decorative diagrams.

## Practical implications for WinDAGs planning

### Use workflow when routing is verdict-driven

If a reviewer or gate can say:

- approved
- rejected
- escalate

then model the plan as a workflow, not a DAG.

### Use a reviewer or gate node, not prose

If quality, policy, or sign-off changes the path, make that a node with conditional outgoing edges.

### Back-edges are allowed only when rework is explicit

Rework loops are legitimate workflow structure when:

- the loop target is known
- exit conditions are defined
- cycle limits are bounded

### Parallel work plus review is still workflow

Parallel workers feeding a reviewer are common workflow shape:

- coordinator -> workers
- workers -> reviewer
- reviewer -> approved delivery or rejected rework

## Common mistakes

### Mistake: calling static review cycles a team

If the role graph is fixed and the routing is by review verdict, use workflow.

### Mistake: using DAG when conditional routing exists

DAGs cannot honestly express approved vs rejected vs escalate routing without encoding that logic elsewhere.

### Mistake: reviewer can reject, but rework target is unspecified

If rejection has no named target, the loop is not designed yet.

## Sources

- W. M. P. van der Aalst, A. H. M. ter Hofstede, B. Kiepuszewski, A. P. Barros, "Workflow patterns", Distributed and Parallel Databases 14(1), 2003.
- W. M. P. van der Aalst, A. H. M. ter Hofstede, "Workflow patterns put into context", Software and Systems Modeling 11, 2012. https://doi.org/10.1007/s10270-012-0233-4
- Repo runtime shape: `packages/core/src/topologies/workflow.ts`
