# Operational Semantics as Interpreter Specification: The Blueprint for Building Correct Agent Systems

## Why Operational Semantics, Not Axiomatic Semantics

There are multiple ways to formally specify the meaning of a programming language or agent system:

- **Axiomatic semantics**: Specify what is true before and after each operation (Hoare triples, weakest preconditions). Good for verification; poor for implementation guidance.
- **Denotational semantics**: Map each program to a mathematical object (a function from states to states). Elegant but often far from the concrete execution.
- **Operational semantics**: Specify how programs execute, step by step, as state transitions. Directly describes what an interpreter should do.

Rao chooses operational semantics, and the choice is not accidental. The entire purpose of AgentSpeak(L) is to bridge theory and practice — to show that a formal specification can correspond directly to a running interpreter. Operational semantics achieves this by describing execution rather than abstract meaning.

The formal definition of an agent as `<E, B, P, I, A, SE, SO, SI>` is not just a mathematical object — it is a specification for a data structure in memory. E is a set of events (implement as a queue or priority queue). B is a set of ground facts (implement as a hash set or database). P is a set of plans (implement as an indexed plan library). I is a set of intention stacks (implement as a list of stacks). A is a set of pending actions (implement as an action queue).

Every element of the formal specification maps to a concrete data structure. This is what Rao means by "one-to-one correspondence between the model theory, proof theory, and the abstract interpreter."

## Reading the Interpreter Algorithm

Rao provides an explicit interpreter algorithm (Figure 1) that translates the formal operational semantics into pseudocode. Let us read this algorithm as a software specification: