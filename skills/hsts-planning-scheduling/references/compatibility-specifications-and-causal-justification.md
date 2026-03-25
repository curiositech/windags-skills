# Compatibility Specifications and Causal Justification: Encoding Domain Knowledge as Constraint Templates

## The Problem with Unstructured Domain Knowledge

Classical planning systems carry domain knowledge as operators: preconditions that must be true before an action can be executed, and effects that become true (or false) after execution. This captures the *logical* structure of action but poorly captures the *temporal* and *resource* structure. An action's preconditions must be satisfied at the instant of execution, but what about conditions that must persist throughout the action? What about resources that must be reserved not just at the moment of use but during preparation and cleanup? What about sequences of intermediate states that an action necessarily passes through?

Classical scheduling systems carry domain knowledge as resource profiles and processing time distributions. These capture temporal structure but sacrifice all causal content — there is no record of *why* an activity requires a particular resource, or what happens to related resources during its execution.

HSTS takes a different approach: domain knowledge is encoded as **compatibility specifications** — formal templates describing the patterns of temporal relationships that must hold in any legal system behavior. These templates are attached directly to state variable values, not to actions, which means they can express both what happens during a value's occurrence and what must be true in the surrounding context.

## The Structure of Compatibilities

A compatibility has the form: