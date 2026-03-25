# Incremental Heuristics and the Scalability Condition: Building Systems That Grow Without Exploding

## The Scalability Problem

Complex real-world systems are large. The Hubble Space Telescope involves dozens of subsystems, hundreds of possible configurations, thousands of temporal constraints, and tens of thousands of scheduling requests per year. Any problem-solving framework must address a fundamental question: as the domain model grows larger and more complex, what happens to computational effort?

For classical combinatorial approaches, the answer is typically: computational effort grows exponentially with problem size. This is not just a performance concern; it is a feasibility concern. A system that takes 10 seconds to plan for 5 components and 10,000 seconds to plan for 10 components is not a system that can be deployed in practice.

Muscettola makes scalability a first-class design criterion: "a modular and scalable framework should display the following two features: (1) the search procedure for the entire problem should be assembled by combining heuristics independently developed for each sub-problem, with little or no modification of the heuristics; (2) the computational effort needed to solve the complete problem should not increase with respect to the sum of the efforts needed to solve each component sub-problem." (p. 19-20)

Feature (2) — additive scalability — is a remarkably strong requirement. Most systems are satisfied with polynomial growth. Muscettola demands *