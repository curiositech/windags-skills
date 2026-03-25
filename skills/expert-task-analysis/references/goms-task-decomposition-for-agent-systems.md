# GOMS as Agent Orchestration: Hierarchical Goal Decomposition with Selection Rules

## What GOMS Is and Why It Matters for Agent Design

GOMS — Goals, Operators, Methods, and Selection Rules — was developed by Card, Moran, and Newell as an information processing model of human-computer interaction. Grassi's thesis applies it to a far more complex domain: the cognitive task of conning a naval vessel to and from a pier. In doing so, it demonstrates that GOMS is not a narrow HCI tool but a **general architecture for representing any hierarchical task structure with conditional branching**.

The four components of GOMS map directly onto the concerns of any agent orchestration system:

| GOMS Concept | Definition | Agent System Analog |
|---|---|---|
| **Goals** | The desired final state or primary objective | Task specification, user intent, mission objective |
| **Operators** | Actions or subgoals that advance the primary goal | Skill invocations, tool calls, sub-agent delegations |
| **Methods** | Procedural sequences of operators that accomplish goals | Skill implementation, workflow templates |
| **Selection Rules** | Rules for choosing among multiple methods when more than one exists | Routing logic, conditional branching, context-sensitive dispatch |

> "Operators represent the actions or subgoals used by the individual to achieve the primary goal... Methods are the procedural sequences of operators designed to accomplish the goal... Selection Rules are the rules by which the user chooses in deciding what method to use when there are multiple methods available to accomplish the goal." (p. 17)

## The Three Levels of Grain

One of GOMS's most useful properties is the concept of *grain of analysis* — the level of detail at which a task is represented. Grassi employs three levels:

### Unit Task Level (Coarsest)
The primary goal with its immediate subgoals. For getting underway:

```
goal: Get A Ship Safely Underway From Pier
  goal: Complete_Brief_Phase (A)
  goal: Ensure_Ship_And_Crew_Is_Ready_To_Get_Underway (B)
  goal: Complete_Clearing_The_Pier (C)
  goal: Complete_Exiting_Pier_Area (D)
  goal: Complete_Entering_Channel_Phase (E)
```

This is the planning layer — sufficient for resource allocation, sequencing, and high-level routing decisions.

### Functional Task Level (Intermediate)
Each unit-level subgoal is decomposed into its own internal sequence. Here we see *recurring goals* — goals that must be repeated throughout the evolution — explicitly flagged:

```
goal: Complete_Clearing_The_Pier (C)
  goal: Complete_Tie_Up_Of_Tug_In_Required_Position
  goal: Receive_Order_From_CO_To_Get_Underway
  goal: Complete_Singling_All_Lines
  goal: Complete_Assessment_Of_Environmental_Effect_On_Ship
  goal: Complete_Taking_In_All_Lines
  goal: Swing_Stern_Away_From_Pier
  goal: Swing_Bow_Away_From_Pier
  goal: Complete_Assessment_Of_Ship's_Movement/Position
  goal: Make_Adjustments
  goal: Ensure_Distance_Between_Ship_And_Pier_Increases
```

Note that `Complete_Assessment_Of_Ship's_Movement/Position` and `Make_Adjustments` appear as recurring loops — they are not one-time actions but *monitoring-and-correction cycles* that continue throughout the phase. This is architecturally significant: the task graph is not a DAG in the strict sense during execution — it is a DAG with explicit loop-back nodes.

### Detailed Task Level (Finest)
Individual operators are specified with their full selection rule structure:

```
goal: Issue_Rudder_Order
  goal: Determine_Direction_Of_Rudder
    [select: Use Left Rudder   ...if moored on port side of ship
             Use Right Rudder  ...if moored on starboard side of ship]
  goal: Determine_Amount_Of_Rudder ...Depending on situation
    [select: Desired_Degrees_Of_Rudder] ...15 degrees of rudder angle
  goal: Give_Verbal_Order_To_Helm
  goal: Receive_Repeating_Of_Order_From_Helmsman
    [select: Acknowledge Repeat Back  ...if order properly understood
             Repeat Order             ...if order not properly acknowledged]
  goal: Determine_If_Order_Was_Executed
    [select: Observe Rudder Angle Indicator]
  goal: Receive_Report_That_Order_Was_Executed_From_Helmsman
    [select: Acknowledge Execution  ...if properly executed
             Repeat Order           ...if not properly executed]
```

This level reveals something important: **every action has an associated verification step**. The conning officer does not just issue orders — they confirm receipt, confirm understanding, confirm execution, and confirm correct execution. This is not paranoia; it is the architecture of reliable action in a noisy, high-stakes environment.

## Selection Rules: The Conditional Logic of Expert Action

Selection rules are where GOMS captures situation-specific decision making. They encode the expert's judgment about *which method applies here* without requiring the expert to consciously deliberate each time.

From the thesis:

> "For example, there are many ways in which a conning officer can execute a port turn. However, if the situation required that the ship be turned around as quickly as possible, the conning officer would then choose the turning method that satisfies the rule for turning the ship quickly, like the method of using a 'left 30 degrees rudder.'" (p. 17)

Selection rules take the form: **[select: Method A ... if Condition X, Method B ... if Condition Y]**

Examples from the pier-side task analysis:

```
goal: Determine_Direction_Of_Rudder
  [select: Use Left Rudder   ...if moored on port side of ship
           Use Right Rudder  ...if moored on starboard side of ship]

goal: Adjust_Rate_Of_Swing_Of_Stern
  goal: Increase_Rate_Of_Swing   ...if rate determined too slow
    [select: Increase RPM on port engine      ...swing direction is stbd
             Increase RPM on starboard engine ...swing direction is port
             Increase RPM on both engines]    ...swing dictated by rudder
  goal: Decrease_Rate_Of_Swing   ...if rate determined too fast
    [select: Decrease RPM on port engine      ...swing direction is stbd
             Decrease RPM on starboard engine ...swing direction is port
             Decrease amount of rudder being used] ...swing dictated by rudder
```

Notice the nested conditional structure: the selection rule at the Increase/Decrease level depends on the direction of the swing, which itself is a perceptual assessment. This is where the GOMS model connects to the Critical Cue Inventory — the condition in the selection rule (`swing direction is stbd`) is determined by perceptual cues documented separately.

## Mapping GOMS to Agent Orchestration Architecture

### Goals → Task Specifications
In a WinDAGs system, a goal corresponds to a task specification passed to an agent or skill. The hierarchy of goals corresponds to a decomposition tree where:
- Top-level goals are task requests from users or parent agents
- Mid-level goals are sub-task specifications dispatched to specialized agents
- Leaf-level goals are direct skill invocations

### Operators → Skill Invocations
Operators are the atomic actions available in the system. In WinDAGs terms, these are the 180+ skills. The GOMS model defines which operators are available for each subgoal, analogous to which skills are available to an agent for each sub-task.

### Methods → Skill Sequences / Workflows
Methods are ordered sequences of operators. In agent terms, these are workflows or skill pipelines — "to accomplish Goal X, invoke Skill A, then Skill B, then verify with Skill C."

### Selection Rules → Routing Logic
Selection rules are the conditional dispatch logic that determines which method to invoke based on current context. In WinDAGs terms, this is the routing layer — the logic that looks at the current state of the task and decides which skill pipeline to activate.

**Critical design implication**: Selection rules require *state assessment* as their input. Before you can apply a selection rule, you must have assessed the relevant condition. This means that task decomposition agents need two types of nodes in their execution:

1. **Assessment nodes** — which read environment state and classify it according to the conditions referenced in selection rules
2. **Method selection nodes** — which apply selection rules given assessed conditions

These are logically distinct even when they appear sequential.

## The Shortfalls of GOMS — and What They Reveal

The thesis is honest about GOMS's limits:

> "One area in particular is GOMS' inability to predict problem-solving behavior. What this means is that although it can predict what the sequence of operators will be for a given task and present it in a structured manner, it has problems explaining what the expert was thinking when accomplishing each task." (p. 19)

More specifically:

> "A GOMS model may show that an expert ship driver may take the action of shifting his rudder because he observed the distance between the ship and pier decreasing. However, what the GOMS model fails to show is what perceptual cues or implicit knowledge the conning officer was using to determine the change in distance." (p. 19)

For agent systems, this translates directly: **a task graph tells you what actions to take, but not how to assess the conditions that determine which actions are appropriate**. The task graph references "slight headway" as a condition; it does not specify how to measure headway from available signals.

This is the architectural gap between task decomposition and perceptual grounding. GOMS + CCI together close this gap. Task graph + explicit state assessment specifications are the agent system analog.

## Recurring vs. One-Time Goals

One of the most practically important structural features in Grassi's GOMS model is the explicit treatment of *recurring goals* — goals that must be repeated multiple times within a single phase:

> "The GOMS model used does not clearly account for the goals that must be repeated numerous times in order for the higher goal to be satisfied. Therefore, these recurring goals have been specifically identified to indicate that in some situations they may have to be repeated." (p. 52)

In the task analysis, `Complete_Assessment_Of_Ship's_Movement/Position` appears throughout the getting-underway sequence. It is not executed once; it is a continuous monitoring loop that runs in parallel with action execution.

For agent systems, this requires distinguishing between:
- **Sequential goals**: A → B → C, where C doesn't begin until B completes
- **Monitoring goals**: A loop that runs continuously throughout a phase, sampling state and potentially triggering adjustments
- **Event-triggered goals**: Triggered by specific state changes (loss of steering, sudden current) rather than sequential completion of previous steps

A DAG-based orchestration system that represents all goals as sequential nodes will systematically fail to represent the monitoring loops that make complex execution robust. These loops should be represented as parallel threads or continuous polling processes running alongside the primary sequence.

## Practical Template: GOMS-Style Capability Documentation

For any complex agent capability, documentation should follow this structure:

```markdown
## Capability: [Name]

### Primary Goal
[What the capability is trying to accomplish]

### Unit-Level Decomposition
1. [Phase A]
2. [Phase B]
3. [Phase C]

### Functional Decomposition of Each Phase
[For each phase, list the ordered subgoals, flagging recurring ones]

### Selection Rules at Key Decision Points
[For each branch point, specify: conditions → method mappings]

### Monitoring Loops
[Specify which goals run continuously rather than once]

### Verification Steps
[For each action, specify: how is correct execution confirmed?]

### Perceptual Requirements
[Reference to CCI: what signals does the agent need to observe to apply selection rules?]
```

This structure ensures that capability documentation captures both the science layer (procedural sequence) and the structure needed to connect to the art layer (state assessment specifications).