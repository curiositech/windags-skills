# Token Networks and Incremental Commitment: Building Schedules Without Over-Committing

## The Architecture of Commitment

Every planning and scheduling system must manage a fundamental tension: to make decisions, you must commit to something; but every commitment restricts future options and risks locking in a suboptimal or infeasible course. The question is not whether to commit — you must, eventually — but *when* and *to what level of specificity*.

Classical systems resolve this tension by committing fully and early: at the start of scheduling, assign resources; assign exact times; determine the complete execution order. This makes the decision-making procedure simple but makes recovery from bad decisions expensive.

HSTS resolves it differently: through a **token network** architecture that supports graduated, incremental commitment. Decisions are made at the coarsest level of specificity that is currently useful, and refined only when additional information justifies further commitment. The system maintains, at every stage, the most accurate possible picture of remaining flexibility.

## Tokens: The Unit of Partial Commitment

The fundamental data structure is the **token** — a 5-tuple: