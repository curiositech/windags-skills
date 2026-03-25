# Atomic Decomposition: The Foundation for Effective Consensus Voting

## The Decomposition Imperative

The Six Sigma Agent architecture rests on a foundational insight: **consensus voting only works when tasks are decomposed to atomic granularity**. This is not merely good engineering practice—it's a mathematical necessity for reliability guarantees.

The paper defines an atomic action with three formal properties:

**Definition (Atomic Action)**: An atomic action a: X → Y is a computational unit satisfying:

1. **Minimality**: Cannot be meaningfully decomposed into simpler sub-tasks without loss of semantic coherence
2. **Verifiability**: Given input x ∈ X and candidate output ŷ, correctness is objectively determinable
3. **Functional Determinism**: Given perfect reasoning, the correct output y* = a(x) is uniquely determined by input x

These criteria "ensure each action is simple enough for reliable consensus verification while remaining semantically meaningful."

## Why Atomicity Enables Consensus

The connection between decomposition granularity and consensus effectiveness is subtle but crucial. Consider two extremes:

**Too Coarse (Complex Task)**: "Analyze this 47-page contract and generate a compliance summary"
- Agent 1 might focus on liability clauses
- Agent 2 might emphasize termination terms
- Agent 3 might prioritize payment conditions
- **No objective basis for voting**—each output is valid but incomparable

**Atomic Granularity**: "Extract the liability limitation amount from Section 12.3"
- Agent 1 returns "$5,000,000"
- Agent 2 returns "$5M"
- Agent 3 returns "5 million dollars"
- **Clear consensus**: All three identified the same value despite surface variation

The paper's embedding-based clustering (Section 4.4) handles surface variation, but this only works when agents are solving the **same well-defined problem**. Atomic decomposition ensures this condition.

## The Dependency Tree Structure

The architecture represents complex tasks as a directed acyclic graph (DAG) G = (V, E) where:
- V = {a₁, a₂, ..., aₘ} is a set of m atomic actions
- E ⊆ V × V represents data dependencies
- (aᵢ, aⱼ) ∈ E indicates aⱼ requires the output of aᵢ

Each node in the tree has:
- **tᵢ**: Task description and specification
- **sᵢ**: Status (pending, in progress, completed)
- **dᵢ ⊆ T**: Dependencies (tasks that must complete first)
- **cᵢ = (nᵢ, θᵢ)**: Sampling configuration (number of samples)

The key architectural principle: "Tasks with no pending dependencies can execute in parallel, while tasks with dependencies execute sequentially after their dependencies complete."

## Practical Decomposition Strategy

The paper provides a concrete decomposition prompt (Appendix B.1) that instructs the system to break tasks into actions satisfying the three atomic properties. For each action, specify:

- **id**: Unique identifier for dependency tracking
- **description**: Precise specification of the computational goal
- **type**: "REASONING" (pure logic) or "TOOL" (external interaction)
- **dependencies**: List of action IDs this depends on
- **output_schema**: Expected output format (JSON preferred for verifiability)
- **tools**: Required tool bindings if type is TOOL

## Case Study: Financial Document Analysis

The paper presents a detailed example (Section 6.7.1) illustrating effective decomposition:

**Complex Task**: Reconcile a vendor invoice ($47,832.15) against a Master Service Agreement with 15 line items.

**Atomic Decomposition** (8 actions):
1. Extract line items from invoice
2. Parse rate schedules from contract
3. Match license SKUs against approved catalog
4. Verify professional services hours
5. Check maintenance fee calculations
6. Validate tax computations
7. Aggregate discrepancy report
8. Generate approval recommendation

**Execution Insight**: Actions 1-6 achieved immediate consensus (5-0 agreement). Action 7 (aggregation) showed 4-1 split where "one agent incorrectly summed a column." Dynamic scaling to 9 agents resolved with 8-1 consensus.

**Outcome**: System correctly identified $234.18 overcharge due to incorrect service tier application.

The critical observation: **consensus failed when one agent made an arithmetic error, not when agents had different interpretations**. This is only possible because the task was atomic and verifiable.

## Action Type Classification

The system classifies each atomic action into one of two types:

**REASONING Actions**: Pure reasoning tasks requiring no external interaction
- Comparison, extraction, summarization
- Calculation, logical inference
- Pattern matching, classification

**TOOL Actions**: Tasks requiring external tool invocation
- API calls, database queries
- File operations, code execution
- External service interactions

This classification "determines execution strategy: reasoning actions use lightweight micro-agents for cost efficiency; tool actions use agents with appropriate tool bindings and implement idempotency protocols."

## Idempotency for TOOL Actions

For TOOL actions that modify external state, the system must ensure **idempotent execution**: running the same action n times produces the same result as running it once. The paper notes this requires:

1. **Check-before-execute**: Verify the state change isn't already applied
2. **Transaction tokens**: Use unique identifiers to prevent duplicate operations
3. **Read-only alternatives**: Where possible, query state rather than modify it

For example, "create database record" becomes:
```
if not exists(record_id):
    create(record_id, data)
return record_id
```

This ensures that consensus voting on TOOL actions doesn't cause unintended side effects.

## World State Manager and Context Propagation

The paper emphasizes that atomic decomposition must be combined with careful context management to prevent error propagation:

"For each completed task tᵢ, the system stores: context(tᵢ) = (y*ᵢ, metadataᵢ) where y*ᵢ is the Judge-selected answer."

When a task tⱼ depends on tasks {tᵢ : tᵢ ∈ dⱼ}, it receives their **verified outputs**:

**input(tⱼ) = {(tᵢ, y*ᵢ) : tᵢ ∈ dⱼ}**

This "ensures downstream tasks receive only verified facts from predecessors, preventing error propagation. This is a key principle from High-Reliability Organization theory."

## Application to WinDAGs: Skill-Level Decomposition

For a system with 180+ skills, atomic decomposition operates at two levels:

**Skill Selection (Coarse)**: The orchestrator routes high-level intents to appropriate skills
**Within-Skill Execution (Fine)**: Each skill internally decomposes its task into atomic actions with consensus voting

Consider the "code_review" skill:
- **NOT atomic**: "Review this PR for quality and security"
- **Atomic decomposition**:
  1. Extract changed files and diff statistics
  2. Identify security-sensitive code patterns (SQL, file I/O, auth)
  3. Check style compliance against standards
  4. Verify test coverage for changed lines
  5. Assess documentation completeness
  6. Generate prioritized issue list

Each of these 6 actions can be executed by n micro-agents with consensus voting, achieving Six Sigma reliability for the overall code review skill.

## Boundary Conditions: When Decomposition Fails

The paper acknowledges limitations:

**Highly Integrated Tasks**: "Tasks resisting atomic breakdown may not benefit. Future work should explore automated decomposition quality assessment."

Examples of problematic tasks:
- **Creative synthesis**: "Write a compelling narrative" has no objective correctness
- **Gestalt reasoning**: "Does this UI feel intuitive?" requires holistic judgment
- **Ambiguous goals**: "Make this code better" lacks verifiable criteria

For these cases, the paper suggests: "Extensions might include preference-based consensus or uncertainty-aware voting."

## The Decomposition-Consensus Loop

The full architecture creates a feedback loop:

1. **Planner** decomposes complex task into atomic actions
2. **Executor** samples n agents per action
3. **Judge** identifies consensus or requests more samples
4. **Verified result** propagates to dependent actions
5. **World State Manager** maintains execution context

The paper proves (Theorem 6) that this architecture achieves end-to-end reliability Re2e = ∏(1 - pₐᵢ), where each pₐᵢ benefits from exponential consensus improvement.

## Practical Guidance for Decomposition

The paper's decomposition strategy can be distilled into actionable principles:

1. **Test for objective correctness**: Can you verify the output without subjective judgment?
2. **Ensure independence**: Can this action execute with only its declared dependencies?
3. **Minimize scope**: Can this be decomposed further without losing meaning?
4. **Specify output schema**: Can you define the expected output format precisely?
5. **Check for tools**: Does this require external interaction beyond reasoning?

If any test fails, the decomposition needs refinement.

## The Meta-Lesson

Atomic decomposition is not just a technical requirement—it's a **philosophical stance** about how intelligent systems should approach complex problems:

**Not**: "Deploy a powerful model and hope it solves the entire problem"
**But**: "Decompose the problem into verifiable units, solve each with redundancy, and compose verified results"

This mirrors how reliable human organizations work: break problems into well-defined tasks, have multiple people verify each task, and assemble verified components into solutions. The Six Sigma Agent formalizes this organizational wisdom into mathematical guarantees.