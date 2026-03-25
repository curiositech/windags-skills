# When Decomposition Enables Tractability: The Boundary Between Solvable and Intractable Oversight

## The Decomposability Thesis

At its core, FORMALJUDGE's success depends on a critical assumption: **Agent oversight tasks admit clean factorization into atomic predicates**.

This isn't universally true. The paper implicitly identifies a boundary:

**Decomposable domains** (where FORMALJUDGE works):
- Tool-using agents with observable actions
- Tasks with specifiable constraints
- Outcomes with verifiable properties

**Non-decomposable domains** (where FORMALJUDGE struggles):
- Creative content generation (subjective quality)
- Open-ended problem solving (no clear correctness criteria)
- Implicit social norms (culturally dependent, context-sensitive)

Understanding this boundary is critical for agent system designers: **Not every oversight problem should be approached with formal verification**.

## The Structure of Decomposability

### Property 1: Observable Grounding

**Definition**: Atomic facts must reference observable evidence in the agent's execution trace.

**Example** (decomposable):
```
Task: "Transfer $500 to Bob if account balance > $1000"

Observable groundings:
- Account balance: read from database query result
- Transfer amount: specified in transfer_funds() arguments
- Transfer recipient: specified in transfer_funds() arguments
- Condition evaluation: balance > 1000 (arithmetic on observed values)
```

Each atomic fact has a **concrete referent** in the execution trace: