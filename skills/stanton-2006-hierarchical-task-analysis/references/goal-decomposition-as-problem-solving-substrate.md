# Goal Decomposition as Problem-Solving Substrate: How HTA Enables Multi-Purpose Analysis

## The Core Insight: Describing What, Not How

The most profound contribution of Hierarchical Task Analysis is frequently misunderstood: HTA does not describe tasks. It describes sub-goal hierarchies. As Annett et al state in their original 1971 specification: "At the highest level we choose to consider a task as consisting of an operation and the operation is defined in terms of its goal." This distinction—between describing activities and describing purposes—is what makes HTA universally applicable across domains and analytical purposes.

Duncan (1972) emphasized that "a task description should not be biased in terms of any particular solution." This neutrality is deliberate and essential. When analyzing a video cassette recorder interface, HTA describes goals like "set recording time" rather than procedures like "press three buttons in sequence." The goal-based description remains valid regardless of whether the interface uses buttons, dials, voice commands, or direct time manipulation. The solution space remains open.

## Why Goal-Based Description Matters for Intelligent Systems

For multi-agent orchestration systems, this principle has immediate implications. When a WinDAGs agent receives a complex objective, the question is not "what sequence of skills should I invoke?" but rather "what sub-goals must be satisfied to achieve this objective?" The goal hierarchy provides the logical structure; the plans provide the control logic for when and how sub-goals are triggered.

Consider Stanton's example of emergency services responding to a hazardous chemical incident. The overall goal "Deal with chemical incident" decomposes into:
- 1. Receive notification
- 2. Gather information about incident  
- 3. Make decision about nature of incident
- 4. Deal with chemical incident (if hazard)
- 5. Resolve incident

Plan 0 specifies: "Wait until 1 then do 2 then 3 - If [hazard] then 4 then 5 then exit - Else exit"

Notice what this representation captures that a procedural task list cannot:
1. **Conditional logic**: Sub-goal 4 only triggers if a hazard condition is detected
2. **Multiple agents**: Police Control, Fire Control, Hospital, and Police Officer each have roles in different sub-goals
3. **System-level view**: The analysis spans organizational boundaries
4. **Exit conditions**: The analysis explicitly models when to stop

An intelligent agent system needs precisely this information. If you only had a procedural list "do A, then B, then C," you couldn't adapt when conditions change. The goal hierarchy with plans provides the decision structure for dynamic coordination.

## The Hierarchical Inclusion Relationship

The third governing principle states: "The important relationship between operations and sub-operations is really one of inclusion; it is a hierarchical relationship. Although tasks are often proceduralised, that is the sub-goals have to be attained in a sequence, this is by no means always the case."

This principle prevents a critical error: confusing hierarchical decomposition with temporal sequence. In the chemical incident example, sub-goal 2.1 "Hospital informs police control of casualty" can happen at any time during sub-goal 2 "Gather information about incident." The plan specifies: "Do 2.1 at any time if appropriate."

For agent systems, this means:
- **Parallel execution**: Some sub-goals can run concurrently (marked with + or "and")
- **Event-driven triggering**: Some sub-goals activate based on conditions, not sequences
- **Flexible ordering**: Some sub-goals can be satisfied in any order (marked with : or "any of")

The hierarchical inclusion relationship means that satisfying a super-ordinate goal requires satisfying all its immediate sub-ordinates, but the sequence and timing are governed by the plan, not by the decomposition structure itself.

## Sub-Goal Templates: Making Implicit Patterns Explicit

Ormerod & Shepherd (2004) formalized patterns that experienced analysts recognize intuitively. They identified sub-goal templates (SGTs) that recur across domains:

**Action Templates**:
- Activate: Make a subunit operational (switch from 'off' to 'on')
- Adjust: Regulate rate of operation while maintaining 'on' state
- Deactivate: Make subunit non-operational

**Exchange Templates**:
- Enter: Record a value in a specified location
- Extract: Obtain value of a specified parameter

**Navigation Templates**:
- Locate: Find location of target value or control
- Move: Go to given location and search it
- Explore: Browse through set of locations

**Monitoring Templates**:
- Detect: Compare system state against target to determine need for action
- Anticipate: Compare state against target to determine readiness for known action
- Transition: Compare rate of change during state transition

For agent orchestration, these templates provide a vocabulary for skill classification. A "locate" sub-goal requires search capabilities; an "anticipate" sub-goal requires predictive modeling; an "adjust" sub-goal requires continuous control. The templates help agents understand what kind of capability each sub-goal demands.

## Plans as Control Structures: Beyond Sequential Thinking

Miller, Galanter, and Pribram's (1960) TOTE (Test-Operate-Test-Exit) units directly influenced HTA's conception of plans. A TOTE unit embeds feedback: test if goal is satisfied, if not perform operation, test again, exit when satisfied.

HTA represents six basic plan types:

1. **Fixed sequence**: "Do 1 then 2 then 3" (linear, deterministic)
2. **Contingent sequence**: "If condition X then do 2, else do 3" (branching)
3. **Parallel sequence**: "Do 1 and 2 and 3 together" (concurrent)
4. **Free sequence**: "Do 1, 2, 3 in any order" (order-independent)
5. **Cyclical**: "Do 1 then 2 then 3 then repeat until condition" (iterative)
6. **Selection**: "Choose one of 1, 2, 3, 4" (exclusive choice)

Real plans often combine these types. For the police officer sub-goal 2.3 "Report nature of incident," Plan 2.3 specifies:
```
If [hazards] then 2.3.1
If [suspects] then 2.3.2 then 2.3.3
Then 2.3.4 then exit
Else exit
```

This combines contingent branching (if hazards/suspects), sequential constraints (2.3.2 must precede 2.3.3), and an unconditional step (2.3.4 always executes if any prior path was taken).

For DAG-based agent systems, plans map naturally to execution graphs where:
- Nodes represent sub-goals (skills to invoke)
- Edges represent dependencies and sequencing constraints
- Edge labels represent conditions for traversal
- The plan specifies the traversal strategy

## The Framework Enables Multiple Analyses

Stanton demonstrates that once the sub-goal hierarchy and plans exist, the same representation supports:

**Error Prediction (SHERPA)**: Each bottom-level sub-goal is classified by type (Action, Retrieval, Checking, Communication, Selection) and analyzed for credible error modes. For "Start-up column 10," potential errors include: operation omitted (A8), operation incomplete (A9), right operation on wrong object (A6).

**Function Allocation**: Each sub-goal is evaluated for assignment to human, computer, or human-computer collaboration. Marsden & Kirby use criteria like task complexity, frequency, criticality, and required knowledge to determine allocation.

**Interface Design**: Stammers & Astley extend tabular format to capture information flow (→ from system to human, ← from human to system), information assumed (prerequisite knowledge), and task classification (monitoring, procedure, fault diagnosis, etc.).

**Team Coordination**: Annett et al analyze which agents handle which sub-goals, communication patterns (send/receive information, discussion), and coordination patterns (collaboration, synchronization).

**Workload Assessment**: By estimating duration, frequency, and cognitive demand for each sub-goal, analysts can identify bottlenecks and overload conditions.

The power comes from analyzing the same goal hierarchy from multiple perspectives. A sub-goal might be low-error-risk but high-workload, or assigned to wrong agent, or missing required information. The tabular format allows systematic annotation.

## When This Framework Applies (and When It Doesn't)

HTA assumes goal-directed behavior. It works when:
- System purpose can be articulated as goals
- Goals can be decomposed into sub-goals
- Performance criteria exist for goal satisfaction
- Control logic governs sub-goal triggering

HTA struggles with:
- **Opportunistic behavior**: When actors respond to situations without clear goals
- **Exploratory activity**: When the goal is to discover what goals should be
- **Purely reactive systems**: When there's no goal beyond "respond to inputs"
- **Highly emergent coordination**: When system behavior arises from local interactions without hierarchical structure

Miller & Vicente (2001) note HTA doesn't naturally represent:
- Physical object relationships and constraints
- Causal propagation through system
- Multiple simultaneous purposes that conflict
- Deep domain knowledge and why certain approaches work

For agent systems, this means HTA provides the "what must be achieved and when" structure, but needs complementary representations for "why it works this way" (domain models), "what objects exist and how they relate" (system architecture), and "how constraints propagate" (dependency analysis).

## Implications for Agent Orchestration

When a complex task enters WinDAGs:

1. **First pass: Goal decomposition**: What is the overall objective? What sub-objectives must be satisfied? This creates the hierarchical structure.

2. **Second pass: Plan specification**: Under what conditions is each sub-goal triggered? What must complete before what? What can run in parallel? This creates the control logic.

3. **Third pass: Skill mapping**: For each bottom-level sub-goal, what capability is required? This maps to available skills in the system.

4. **Fourth pass: Agent assignment**: Which agent has required capabilities? Are there coordination constraints? This creates the execution plan.

5. **Fifth pass: Error analysis**: Where can things go wrong? What are consequences? What recovery is possible? This creates the resilience strategy.

The goal hierarchy serves as the organizing structure for all subsequent analysis. Without it, you have a flat collection of skills with no organizing principle. With it, you have a system model that can be analyzed, optimized, and executed.

## The Meta-Lesson: Decomposition Strategy Matters

HTA succeeds because it decomposes by purpose (goals) rather than by activity (tasks), time (sequences), or agent (roles). This creates a representation that:
- **Transcends implementation**: Same goal structure, different realization strategies
- **Supports multiple analyses**: Error, workload, allocation, coordination all use same substrate
- **Scales hierarchically**: Refine where needed, stop where adequate
- **Captures control logic**: Plans encode the intelligence about when goals matter

For building intelligent systems, the lesson is: decompose your problem space by the objectives that must be achieved, then layer in the control logic for how those objectives coordinate. Don't start with "here's a sequence of things to do." Start with "here's what must be accomplished, and here's when each part matters."

The sub-goal hierarchy is your system's logical architecture. Everything else—skills, agents, interfaces, error handling—organizes around it.