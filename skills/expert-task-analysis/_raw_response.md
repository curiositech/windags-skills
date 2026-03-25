## BOOK IDENTITY

**Title**: *A Task Analysis of Pier Side Ship-Handling for Virtual Environment Ship-Handling Simulator Scenario Development*
**Author**: Charles R. Grassi (Naval Postgraduate School Master's Thesis, 2000)
**Advisors**: Rudolph P. Darken and Barry Peterson

**Core Question**: How do expert practitioners actually perform complex, multi-variable physical tasks — and how can that expertise be captured formally enough to train novices and drive intelligent simulation systems?

**Irreplaceable Contribution**: This thesis is one of the rare documents that applies **Cognitive Task Analysis to a highly physical, perceptual, time-critical domain** (ship-handling) using a hybrid method: GOMS for explicit procedural structure, and Critical Cue Inventories for the implicit perceptual knowledge that GOMS cannot capture. The combination reveals something most AI/agent systems miss: **expert decision-making is not primarily logical deduction — it is perceptual pattern recognition married to procedural scaffolding**. The thesis also documents, with unusual candor, the structural limits of any single representational model. No other document in the ship-handling literature provides this dual-layer decomposition at this level of operational specificity.

---

## KEY IDEAS

1. **The Science/Art Divide**: Every complex skilled task has two layers — the *science* (explicit procedures, physics, rules) and the *art* (perceptual judgment, timing, situational feel). Training systems that only teach the science produce novices who "parrot" orders but cannot handle novel situations. GOMS captures the science layer. Critical Cue Inventories are required to capture the art layer. Agent systems that decompose tasks into only explicit sub-goals are making the same mistake as SWOS without its YP boats.

2. **Perceptual Cues Are Load-Bearing Structure**: Expert performance is not primarily mediated by conscious reasoning. When an expert ship-handler is asked *how* he knows the stern is safe to swing, he says "I just know when it is." The real decision-triggering mechanism is a curated inventory of perceptual signals — wake patterns around pier pilings, tension in mooring lines, the sound of EOT bells, smoke from the stack, relative motion of a fixed point on the pier. These cues are not decorative; they are the actual inputs to the decision function. Any simulation (or agent) that lacks fidelity on these signals is training the wrong skill.

3. **Hierarchical Goal Decomposition with Selection Rules**: The GOMS framework reveals that expert task execution is not a flat checklist — it is a hierarchy of goals, where each level has its own selection rules based on situational context. The conning officer doesn't just "stop the ship" — he selects between backing bell on outboard screw vs. both screws based on the amount of headway, which itself is assessed via multiple redundant perceptual channels. This nested conditional structure is directly isomorphic to agent orchestration trees.

4. **Redundant Multi-Channel Sensing**: At every decision point in pier-side ship-handling, the expert maintains *multiple independent channels* for the same information (radar, bow watch verbal report, visual estimation, tug feedback, navigator position report). Single-source information is explicitly considered insufficient. This redundancy is not inefficiency — it is robustness under degraded conditions. Agent systems that route information through a single channel are architecturally fragile in the same way a helmsman with only a gyrocompass is fragile.

5. **The Validation Gap — What Experts Don't Say**: The CDM validation process revealed a critical failure in the initial GOMS model: the expert who built the first model *forgot to include tugboats* because he assumed no tugs would be available. Every single validation participant used tugs. The lesson: initial task models built by any single expert are systematically incomplete in predictable ways — they omit tools so routine that the expert has stopped noticing them. Formal validation against multiple independent experts is not optional.

---

## REFERENCE DOCUMENTS

### FILE: expert-knowledge-two-layers.md
```markdown
# The Two-Layer Structure of Expert Knowledge: Science and Art in Complex Task Performance

## The Central Problem This Document Addresses

When you ask an expert to explain what they do, they tell you the science. When you watch them perform, you see the art. These are not the same thing, and confusing them produces systems — training simulators, AI agents, knowledge bases, checklists — that teach the wrong things with high confidence.

Grassi's 2000 thesis on pier-side ship-handling puts this problem in unusually sharp relief. The thesis opens with a distinction that should be foundational for any intelligent system designer:

> "Often described as an art, a science and a skill, ship-handling is an individual's ability to apply science to develop the art of competently maneuvering a vessel safely and efficiently. Therefore to be a skilled shiphandler, one must master the science, understand the knowledge, and display the art, whenever and wherever required." (p. 1)

This is not rhetorical flourish. It is a precise structural claim about the architecture of expertise. And it leads directly to a diagnostic of why training fails:

> "This problem was not due to the fact that these officers knew nothing about the 'science' or fundamentals of ship-handling, but rather that they were not given the proper training to acquire the 'art' of ship-handling." (p. 1)

The young Surface Warfare Officers arriving at their first command knew the physics of propeller side-force, the six forces acting on a ship, the standard engine and rudder commands. They had this knowledge. What they lacked was the capacity to *act on it in real time under uncertainty* — the perceptual discrimination, the timing sense, the feel for when a rate of swing is "too fast" before the stern strikes the pier.

## What the Science Layer Contains

The science layer of any complex skill is:
- **Explicit and articulable**: It can be written down in manuals, taught in classrooms, expressed in notation
- **Procedural and sequential**: It has a logical order, prerequisites, and if-then structure
- **Domain-physics grounded**: It derives from causal relationships in the world (propellers push water, rudders deflect flow, currents carry hulls)
- **Transferable without practice**: Reading Naval Education and Training Command's NAVEDTRA 10776-A gives you the science

The GOMS model (Goals, Operators, Methods, Selection Rules) captures this layer. At the science level, "stopping a ship" becomes:

```
goal: Stop_Headway_Of_Ship
  [select: Order_Backing_Bell_On_Outboard_screw  ...if slight headway
           Order_Backing_Bell_On_Both_screws     ...if moderate headway]
  goal: Verify_No_Forward_Motion
    method: Assess ship's movement and position
  goal: Order_Engine(s)_Stopped
```

This is teachable. It is correct. It is necessary. And it is insufficient.

## What the Art Layer Contains

The art layer is:
- **Implicit and difficult to articulate**: Experts often say "I just know when it is"
- **Perceptual and pattern-based**: Triggered by specific sensory cues, not logical inference
- **Timing-dependent**: The same action at different moments produces different outcomes
- **Acquired through practice, not instruction**: Cannot be transmitted via text alone

The diagnostic moment in Grassi's thesis comes during knowledge elicitation:

> "When an expert ship-handler was asked to explain how he knows when a ship is far enough away from the pier so that its stern will not collide with it when the ship is getting underway, he responded with, 'I can't explain it. I just know when it is.'" (p. 16)

This is not evasion. It is an honest report of how expert cognition actually works. The knowledge is real and reliable — the expert reliably doesn't hit the pier — but it is encoded in perceptual pattern recognition, not in articulable rules. The critical question is: *what is the expert actually perceiving?*

The thesis answers this through Critical Cue Inventories. The "just knowing" resolves into specific signals:
- The open space between stern and pier, compared to known reference dimensions (the brow is approximately 16 feet)
- The rate at which the corner of the stern moves through the water
- The relative motion of a fixed point on the pier (an empty box, a paint mark)
- The verbal distance reports from the stern watch
- The churning of water as propellers engage

None of these require magic. They require a trained perceptual system that has associated these specific stimuli with specific states of the world.

## Why Training Systems Fail When They Only Teach Science

A training system that teaches only the science layer produces what the thesis calls "parrots":

> "Most junior officers are so nervous and inexperienced when they conn a ship for the first time that they usually end up being a 'parrot' where all they do is repeat orders given by the OOD or commanding officer." (p. 7)

Parrots know the commands. They can recite the selection rules. They cannot execute the selection rules because they cannot perceive the conditions the rules reference. When the GOMS model says "select: Order_Backing_Bell_On_Outboard_screw ... if slight headway" — the parrot does not know what *slight headway feels like*. They don't know which visual cues indicate slight vs. moderate. They don't have the perceptual vocabulary.

This is the gap between knowing something and doing it — between declarative and procedural knowledge, between understanding a procedure and having the situational awareness to trigger it correctly.

## The Structural Implication for Agent System Design

An AI agent that performs complex tasks inherits exactly this problem. Consider a task decomposition agent given a complex multi-step task:

- **Science layer**: The agent can represent the logical structure of the task — prerequisites, ordering constraints, conditional branches, resource requirements. This is the GOMS layer. Tools like task graphs, workflow engines, and planning algorithms operate here.

- **Art layer**: The agent must also perceive and classify the *current state of the environment* in ways that trigger the correct branch at each decision point. This requires not just logic but *perceptual categories* — what counts as "slight headway," what counts as "mooring lines under strain," what counts as "proper approach angle."

When agents fail at complex tasks, the failure usually occurs at the art layer, not the science layer. The agent's logical decomposition is correct. But the agent misclassifies the current state of the world and applies the right method to the wrong situation.

### Design Principle: Separate the Procedural from the Perceptual

For any complex capability, a WinDAGs agent system should maintain:

1. **A GOMS-equivalent task graph** — the explicit hierarchical decomposition of goals into subgoals into methods into selection rules. This is the science.

2. **A Critical Cue Inventory equivalent** — for each decision point in the task graph, an explicit list of observable signals that classify the current state. This is the art.

The GOMS model alone tells you *what to do*. The CCI tells you *how to know when to do it*. Both are required.

### Design Principle: Distinguish Articulable from Tacit Knowledge

When building agent capabilities, assume that:
- Subject matter experts will naturally provide science-layer knowledge
- Art-layer knowledge requires specific elicitation methods (the CDM equivalent: scenario walkthroughs, "what did you notice just before you did X?", multiple expert cross-validation)
- Initial capability specifications will be systematically deficient in art-layer content
- Validation against real performance (not just expert review) is necessary to surface the gaps

### Design Principle: Practice Environments Are Not Optional

The thesis is emphatic that art cannot be transmitted through text:

> "The skill of ship-handling cannot be learned by solely reading books or observing someone else. Like so many other things in life, one cannot become proficient at something without practice." (p. 2)

For agent systems, this translates to: capabilities that require perceptual judgment must be validated in high-fidelity environments that provide the relevant perceptual signals. Testing a complex reasoning agent only on abstract symbolic inputs is equivalent to training a ship-handler only in the classroom. The agent will be a parrot when deployed.

## Boundary Conditions

This framework applies most forcefully when:
- The task is highly physical, time-critical, or deeply embedded in perceptual context
- Expert performance is visibly superior to novice performance without being fully explicable
- The cost of real-world practice is high (dangerous, expensive, rare)

It applies less forcefully when:
- The task is primarily symbolic or logical (where articulation captures most of performance)
- The relevant state of the world is fully and accurately represented in machine-readable form
- The perceptual signals are identical between training and deployment environments

The danger zone is tasks that *appear* to be purely logical (code review, security auditing, architectural assessment) but that actually involve significant tacit perceptual judgment — "this codebase feels fragile" is an art-layer judgment even if expressed verbally. These tasks benefit from explicit CCI-style documentation of the signals that trigger expert intuitions.
```

### FILE: goms-task-decomposition-for-agent-systems.md
```markdown
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
```

### FILE: critical-cue-inventories-for-agent-perception.md
```markdown
# Critical Cue Inventories: Documenting the Perceptual Vocabulary of Expert Performance

## The Problem That CCIs Solve

Every complex task involves decision points. At each decision point, some condition must be assessed before the correct method can be selected. The GOMS model names these conditions — "if slight headway," "if moored on port side," "if rate determined too slow" — but it does not specify how to *perceive* these conditions from available signals.

This is the gap that Critical Cue Inventories (CCIs) fill. A CCI is a structured inventory of:
- **What specific signals the expert attends to** at each decision point
- **How those signals appear** (what they look like, sound like, feel like)
- **What condition the signal indicates** (what the expert infers from the signal)
- **Why that signal is useful** (why it is reliable, what alternatives exist)

Grassi's thesis produces fifteen CCIs covering all major decision phases of pier-side ship-handling. They represent some of the most practically valuable content in the document, because they decode what expert experience actually encodes.

## Anatomy of a CCI: Environmental Assessment

The most fundamental CCI in the thesis covers environmental assessment — what the conning officer observes to determine wind direction, current direction, and their magnitudes before deciding on a maneuvering strategy.

| CUE | DESCRIPTION |
|---|---|
| State of water in channel | The conning officer looks at white caps or ripples. Direction of flow indicates wind direction. Calm water indicates absence of strong wind. |
| Pennants/Flags | Direction the flag blows indicates true wind direction. Sound of flapping indicates magnitude — "quick, succinct whipping noises usually indicate a strong wind." |
| Buoys | A buoy normally floats upright. Strong wind or current causes it to lean. The direction of its wake indicates current direction. |
| Fenders | Freely floating fenders indicate ship is being "set off" the pier. Extremely pinched fenders indicate being "set on." |
| Mooring Lines | Very taut lines indicate ship being set off pier. Very slack/dipping lines indicate ship being set on to pier. |
| Wind bird | Direction it points = direction wind is blowing from. Rate of propeller spin = magnitude of wind. |

What makes this table powerful is not its content per se — any navy manual covers this. What makes it powerful is **the cognitive function each cue serves**. Each entry explains not just what the expert observes but *what decision the observation enables*.

Notice also the redundancy: six separate signals for essentially two quantities (wind direction/magnitude and current direction/magnitude). This is not belt-and-suspenders overcaution. Each signal has different reliability profiles in different conditions (flags are useless in still air, buoys are useless in open water with no obstacles). An expert automatically triangulates across available signals; the CCI makes this triangulation explicit.

## Anatomy of a CCI: Motion Assessment

The most frequently recurring CCI in the thesis covers assessment of ship's movement and position — how the conning officer determines whether the ship is moving toward or away from the pier, and at what rate.

| CUE | DESCRIPTION |
|---|---|
| Change in separation between ship and pier | Conning officer watches the space between ship edge and pier edge. Larger space = moving away. Smaller space = moving toward. |
| Rate of swing of bow and stern | For bow: watch the "bull nose" opening — rate at which water or fixed objects pass by. For stern: watch the corner of the stern moving through the water. |
| Forward/aft motion of a fixed point on the pier | Select a fixed point (crate, paint mark). If it appears to drift forward, ship is moving aft. If it appears to drift backward, ship is moving forward. |

The third cue — relative motion of a fixed point — is particularly elegant. It converts absolute motion of the ship (hard to perceive from aboard the ship) into relative motion of a stationary object (very easy to perceive). The expert does not assess "ship is moving at X knots" — they assess "that box appears to drift toward me," which is functionally equivalent but perceptually far more accessible.

This is a general principle: **experts convert hard-to-perceive quantities into easier-to-perceive proxies**. A CCI makes these proxy mappings explicit, allowing the system to replicate the detection without replicating the years of experience that taught the expert which proxies to use.

## Anatomy of a CCI: Execution Verification

One CCI that might initially seem like operational detail reveals a deep architectural principle: the CCI for verifying that an engine order was actually executed.

| CUE | DESCRIPTION |
|---|---|
| Churning of water at stern | Propellers turning causes millions of tiny bubbles to surface. Visible as smoothing/turbulence at stern. |
| Plume of smoke exiting smoke stack | Additional smoke indicates engines accelerating. |
| Sound of engines accelerating | Distinctive revving sound, best heard from bridge wing. |
| Hear bell of EOT acknowledgment | EOT bell signals engineering plant has acknowledged and is executing the order. |

Why does this exist? Because in a noisy, complex operational environment, the conning officer cannot assume that an order given was an order received and executed. The verbal order could have been misheard. The lee helmsman could have moved the telegraph to the wrong position. The engineering plant could be experiencing a casualty. The ship's response to engine orders could be delayed or absent for mechanical reasons.

The CCI operationalizes an implicit rule: **trust but verify, via multiple independent channels**. Visual (wake, smoke), auditory (engine sound, EOT bell), and mechanical (expected ship response) channels are all used to confirm execution. If any one channel suggests non-execution, the conning officer investigates and corrects.

For agent systems: this is the architecture of reliable action. Every consequential skill invocation should have an associated verification step, and that verification should use signals independent from the invocation channel. "The skill returned success" is one signal. The downstream effects of the skill's action are a second signal. Both should be checked.

## The Diagnostic Gap: What Experts Don't Mention First

The CDM validation process reveals a systematic pattern: **experts reliably omit their most deeply automatized cues in initial recollections**. These are not the cues they consciously use — these are the cues they can't not use, the ones so fundamental to perception that they've become invisible.

> "When experts were asked to first describe the task of getting a ship underway from a pier, they often failed to mention the perceptual cues that they used in making an initial assessment of the environmental effects on the ship. It was only after asking how he determined the current of the water that he began to explain his use of visual cues, such as wakes being made by the channel buoy, to make an assessment." (p. 22)

The expert used the buoy wake cue *every time*. But when asked "how do you get underway from a pier?" the buoy wake cue did not appear in the initial account — because it had been fully automatized below the threshold of conscious reflection.

This is a general property of expertise: the most reliable cues are the most invisible. Initial knowledge elicitation will systematically miss them. Probe questioning ("how did you know X?", "what did you notice just before you did Y?") and validation against multiple experts are required to surface them.

For agent system development: capability documentation built from a single expert's first-pass account will be systematically deficient in exactly the ways that matter most. The missing cues are the ones the expert uses *most reliably* — which means they are the load-bearing elements of the skill.

## CCI Structure for Agent Systems

In a WinDAGs context, a CCI-equivalent for any complex skill would document, for each decision node in the task graph:

```markdown
## Decision Point: [Name of condition that needs to be assessed]

### Purpose
What this assessment enables — which selection rule it feeds

### Primary Signals
| Signal | How to detect it | What it indicates | Reliability notes |
|---|---|---|---|
| [Signal 1] | [Detection method] | [What this indicates] | [When this is/isn't reliable] |
| [Signal 2] | ... | ... | ... |

### Proxy Signals
[Signals that stand in for harder-to-measure quantities]

### Redundancy Structure
[Which signals can substitute for which others if unavailable]

### Failure Modes
[Conditions under which signals are unreliable or absent]

### Verification Protocol
[How to confirm that the assessment is correct before acting]
```

This structure forces explicit documentation of:
1. The perceptual inputs required for each decision
2. The proxy relationships that make abstract states observable
3. The redundancy that makes assessment robust
4. The conditions under which assessment fails

Without this documentation, task graphs are incomplete — they reference conditions that no agent knows how to detect.

## Cross-Domain Application: CCIs Beyond Physical Tasks

The CCI concept applies far beyond physical ship-handling. Consider the "art" layer in:

**Code review**: What signals indicate that a codebase is structurally fragile? Experts "just know" — and that knowing resolves into specific signals: inconsistent naming conventions, God objects, commented-out code throughout, test files that mirror production file structure exactly (indicating copy-paste test writing), imports that suggest circular dependencies. A CCI for code quality assessment would make these signals explicit.

**Security auditing**: What signals indicate that an authentication implementation has fundamental flaws? Again, experts see these patterns tacitly. A CCI would catalog: direct string comparison of secrets, absence of timing-constant comparison functions, session tokens that contain user role information, password reset flows that accept user-supplied tokens.

**Architecture design**: What signals indicate that a proposed architecture will not scale? A CCI: synchronous calls across service boundaries where the callee may be unavailable, unbounded queues with no backpressure mechanism, shared mutable state across independently deployable components.

In each case, the CCI does not replace expert judgment — it makes the *vocabulary* of expert judgment explicit enough to be taught, validated, and implemented in agent systems.
```

### FILE: redundant-sensing-in-multi-channel-environments.md
```markdown
# Redundant Multi-Channel Sensing: Why Experts Never Rely on a Single Signal

## The Architecture of Reliable Perception Under Uncertainty

One of the most consistent structural features in Grassi's task analysis of pier-side ship-handling is that at every significant decision point, the conning officer maintains *multiple independent channels* for the same information. This is not described explicitly as a design principle in the thesis — it emerges from the CCIs as an empirical fact about how experts perceive.

Consider the CCI for assessing distance between ship and pier:

| Signal | Method |
|---|---|
| Open space between stern and pier | Visual estimation, compared to known reference (brow ≈ 16 feet) |
| Open space between bow and pier | Visual estimation from bridge wing |
| Diameter of fenders | Visual estimation at waterline |
| Verbal report from bow watch | Radio communication |
| Verbal report from stern watch | Radio communication |
| Surface radar reading | Electronic instrument |
| OOD consultation | Verbal exchange |

Seven channels for a single quantity (distance to pier). In practice, a conning officer uses some subset simultaneously. They cross-reference. They update their estimate when channels disagree. They do not trust any single channel absolutely.

Or consider assessing whether an engine order was executed (from CCI Table 6):
- **Visual**: churning water at stern (propeller cavitation bubbles)
- **Visual**: plume of smoke from smokestack
- **Auditory**: sound of engines accelerating
- **Auditory**: bell of EOT acknowledgment

Four channels, two sensory modalities. Any one might be absent or degraded (storm conditions obscure the stern, noise masks engine sounds, the EOT bell fails). The ensemble is robust even when individual channels are not.

## Why Single-Channel Reliance Is a Systematic Failure Mode

The value of multi-channel sensing becomes visible when you consider what happens when single channels fail:

**Loss of gyrocompass**: 
> "The most common indication to the conning officer will be that the gyrocompass alarm will sound on the bridge. Other indications might be that the gyrocompass repeater will not move with the changes in the ship's direction or begins to spin wildly out of control. Although this is the primary means for monitoring the ship's heading, the conning officer must shift to using the magnetic compass." (p. 35)

The primary channel (gyrocompass) can fail. When it does, a backup channel (magnetic compass) must be immediately available. The expert does not need to *decide* to use the backup in the moment of failure — the backup is already part of the trained perceptual system.

**Loss of steering**:
> "Another indication is that the rudder does not respond to the action of the wheel being turned by the helmsman. The response of the conning officer is to immediately shift to the stand by steering unit." (p. 34)

The rudder's non-responsiveness is itself a perceptual cue — a second-order cue that something is wrong with the primary channel. Experts monitor not just task-relevant signals but also signals about the *reliability of their primary signals*.

This is meta-perception: perceiving whether your perception is working. It requires a second, independent monitoring layer.

## The Redundancy Hierarchy: Primary, Secondary, Tertiary

Across the task analysis, a consistent hierarchy emerges:

**Primary channel**: The fastest, most reliable, most frequently used signal under normal conditions. For most distance assessments, this is direct visual estimation. For engine execution, it's the EOT bell.

**Secondary channel**: A backup available when the primary is degraded or ambiguous. For distance, the bow/stern watch verbal reports. For heading, the magnetic compass.

**Tertiary channels**: Additional confirmation used when there is doubt or when the stakes are high. For distance, radar. For environmental assessment, chart consultation.

The expert's cognitive model allocates attention according to this hierarchy — usually monitoring the primary channel, occasionally sampling the secondary, deliberately consulting the tertiary when uncertain or when a decision is consequential.

## Implications for Agent System Design

### Principle 1: Every consequential input should have at least two independent channels

An agent that receives information through a single channel is architecturally fragile in the same way a ship-handler who only watches the gyrocompass is fragile. When the gyrocompass fails (or when the API returns a wrong value, or when the tool call errors), there is no fallback.

For any skill that reads environmental state before making a consequential decision, the skill specification should include:
- Primary sensing method
- At least one secondary sensing method
- Criteria for when to escalate to secondary
- What to do when channels disagree

### Principle 2: Channels should be independent in their failure modes

Five witnesses who all saw the same security camera footage are not five independent witnesses to the original event. Similarly, five tools that all call the same underlying API are not five independent channels. Independence means *different failure modes* — if the primary fails, the secondary remains available.

For agent systems: tools that query the same database are not independent. Tools that use the same authentication mechanism share a failure mode. True redundancy requires architectural independence.

### Principle 3: Disagreement between channels is itself informative

When the conning officer's visual estimate of distance disagrees with the stern watch's report, something is wrong — either the estimate is off, the watch is off, or there's a parallax issue. This disagreement is a signal that demands resolution, not a problem to ignore.

For agent systems: when two information sources disagree, the agent should not silently use one and discard the other. The disagreement should be flagged and resolved. The resolution process itself often reveals important information about the task state.

### Principle 4: Monitor second-order signals (is my perception working?)

The conning officer does not just monitor whether the ship is responding correctly — they monitor whether their monitoring instruments are working. Gyrocompass alarm, rudder non-responsiveness, EOT bell non-acknowledgment: these are all signals that the primary sensing layer has failed.

Agent systems should implement analogous second-order monitoring:
- Is the tool returning results in expected time ranges?
- Are returned values within plausible ranges?
- Do multiple independent queries return consistent results?
- Is the information freshness acceptable?

When second-order signals indicate monitoring failure, the agent should switch to secondary channels before proceeding, not after a failure has caused a consequential error.

### Principle 5: Communication confirmation is not communication

The GOMS model for issuing a rudder order includes:
```
goal: Give_Verbal_Order_To_Helm
goal: Receive_Repeating_Of_Order_From_Helmsman
  [select: Acknowledge Repeat Back  ...if order properly understood
           Repeat Order             ...if order not properly acknowledged]
goal: Determine_If_Order_Was_Executed
  [select: Observe Rudder Angle Indicator]
goal: Receive_Report_That_Order_Was_Executed_From_Helmsman
```

The conning officer gives the order, receives a repeat-back (confirmation of *receipt*), observes the rudder angle indicator (confirmation of *execution*), and receives a verbal execution report (second confirmation of execution). Receipt and execution are separately confirmed, through independent channels.

The analogous failure in agent systems: assuming that a tool call that returned without error means the intended operation was performed. The tool's success return is confirmation of *communication*. Confirmation of *execution* requires observing the downstream effect of the action.

For consequential agent actions, the pattern should be:
1. Issue the action (invoke skill)
2. Receive acknowledgment (skill returns)
3. Verify execution (observe effect in a channel independent from the skill's own return value)
4. Confirm correct execution (compare observed effect against expected effect)

Steps 3 and 4 are commonly omitted in agent system design. Their omission is a systematic reliability risk.

## The Limits of Redundancy

Multi-channel sensing does have costs and limits:

**Time cost**: Sampling multiple channels takes longer than sampling one. In time-critical situations, the number of channels queried must be reduced to match available time. The conning officer doesn't consult charts and radar during a crash-stop scenario — they act on primary visual signals and adjust.

**Consistency maintenance**: When channels disagree, resolution takes effort. If resolution is required at every decision point, system velocity collapses.

**Channel correlation**: In practice, channels are often correlated — they share common upstream causes that can fail together. True independence is asymptotic; the redundancy hierarchy reduces single points of failure but cannot eliminate them.

**Diminishing returns**: Beyond three or four independent channels, additional channels rarely add meaningfully to reliability. The architecture should be designed for a practical level of redundancy, not infinite redundancy.

The practical design target: **two independent primary channels for every consequential sensing point, with tertiary channels available for high-stakes or uncertain situations**.
```

### FILE: validation-gap-what-experts-dont-know-they-know.md
```markdown
# The Validation Gap: What Initial Models Miss and Why It Matters

## The Tugboat Revelation

The most practically important finding in Grassi's thesis is buried in a single paragraph about the validation process. It deserves to be extracted and examined in full:

> "Throughout the entire validation process there was only one discrepancy that was considered significant enough to warrant changes to the GOMS model. The discrepancy was over the use of tugboats. The initial GOMS model was originally constructed under the assumption that no tugs would be available and that the conning officer would have to use only the ship in getting underway or mooring to a pier. Therefore, the initial GOMS model did not reflect any procedures concerning the use of tugboats. However, all of the participants opted to use tugboats. Thus, they all found that the model would not be accurate if it did not provide procedures for using a tug. In fact, all of the participants agreed that, due to the severe consequences of damaging the ship, it is very rare any type of pier side ship-handling would be conducted without the assistance of a tugboat. Therefore the model was changed to reflect using the assistance of a tugboat." (p. 50)

This is stunning. The initial model — built by a surface warfare officer with extensive ship-driving experience, reviewing actual Commanding Officers' Standing Orders and navy training documents — completely omitted tugboats. Every validation participant used them. Every participant agreed they were nearly mandatory. The initial model was not wrong in its logic; it was wrong in its fundamental assumptions about what actors exist in the system.

## Why This Happens

The expert who built the initial model knew about tugboats. The model was not built by someone who had never seen a tug. The expert had worked with tugs extensively. But when constructing a "generic" model without specific constraints, the expert defaulted to the most theoretically minimal case — no tug, just the ship — because tugs are *externally provided resources*, not intrinsic to the conning officer's cognitive task.

This reveals a systematic cognitive bias in single-expert knowledge elicitation: **experts naturally model the core of their domain and underspecify the supporting infrastructure**. The conning officer's expertise is ship-handling; tugs are external coordination. The expert thinks "I can explain how I drive the ship" and builds a model of ship-driving. The tug is something that *happens* in the environment; it's not something the expert cognitively owns.

But in practice, the tug is not optional infrastructure. It is a load-bearing element of virtually every pier-side evolution.

## The General Pattern

This is not unique to ship-handling. Every complex domain has its equivalent of the missing tug:

**Software development**: Initial task models of "write a feature" built by developers often omit: code review processes, deployment pipelines, monitoring and alerting setup, documentation updates, dependency management, backward compatibility consideration. These are "infrastructure" that developers experience as external to the act of coding — but all of them are necessary components of actually shipping the feature.

**Security auditing**: Initial models built by security experts often omit: communication of findings to stakeholders, prioritization based on business context, remediation guidance at the right specificity level, false positive triaging. The expert's expertise is in finding vulnerabilities; the surrounding process is "someone else's job."

**Data analysis**: Initial models often omit: data cleaning and validation, uncertainty quantification, communicating confidence intervals to decision-makers, handling missing data, verifying that analysis assumptions hold for the specific dataset.

The missing elements share common properties:
- They are *coordination* or *context* elements, not *core* elements
- The expert experiences them as given in their normal practice, making them invisible
- They are critical to success in real-world deployment
- They are supplied by systems or people external to the expert's primary role

## The CDM Solution: Probe Questions Toward What Wasn't Said

The Critical Decision Method addresses this gap through structured probe questioning. The CDM's multi-pass structure is specifically designed to surface what was omitted from initial accounts:

**First pass**: Expert recounts the task freely — captures what the expert consciously owns as "their" task.

**Second pass**: Interviewer identifies decision points and probes each — "at this moment, what did you do? Why? What did you notice just before?" — surfaces the first layer of tacit knowledge.

**Third pass**: Probe questions focus on counterfactuals — "what if X had been different? What if Y wasn't available?" — surfaces assumptions the expert didn't know they were making.

The tugboat gap would have been caught on the third pass: "What if no tug was available? How would you proceed?" This question makes visible an assumption that was invisible in the first two passes — the assumption that a tug *would* be available.

For agent system development, the equivalent is a structured challenge process during capability specification:
- "What external resources does this capability assume?"
- "What would happen if [resource X] were unavailable?"
- "What coordination with other systems happens in the background that we haven't modeled?"
- "What does this look like in the 10% of cases that don't match the 'standard' scenario?"

## Multiple Independent Validators Are Not Optional

The tugboat gap also illustrates why multiple independent validators are necessary. A single validator might not surface this issue if they happen to share the same background assumption. Five validators — all from different ships, different commands, different years of experience — unanimously agreed that tugs were nearly mandatory. The unanimity itself carries evidential weight that no single validator's opinion could.

This mirrors scientific replication: a finding from one experiment is a hypothesis. A finding that replicates across five independent experiments begins to constitute knowledge. For task models, validation by one subject matter expert produces a refined model. Validation by five independent experts with diverse experience begins to produce a reliable model.

The practical design implication for agent system capability development:

**One expert → initial specification** (expect omissions and expert-specific idiosyncrasies)
**Two to three experts → primary validation** (expect disagreements that illuminate decision space)
**Five or more experts → confidence in generality** (surfaced assumptions, found missing elements, characterized variability)

Shortcuts at this stage are not efficient. They produce capability specifications that work in demonstrations but fail in production when the scenarios diverge from the single expert's experience.

## What Multi-Expert Validation Reveals

The thesis methodology — five validators with defined selection criteria (twin/multi-screw ship experience, at least 10 pier-side evolutions, recently departed at-sea tour) — reveals several distinct categories of insight beyond the initial model:

**Category 1: Universal Omissions** (the tugboat gap)
Items every validator agreed were essential but the initial model omitted. These represent systematic blind spots in the initial model.

**Category 2: Alternative Methods**
Legitimate variations in how different experts perform the same task. Expert A always uses the jack staff for bearing; Expert B prefers landmarks. Both are correct; the selection rules differ based on individual mental models. The validated model should include both methods with appropriate selection rules.

**Category 3: Disagreements About Best Practice**
Areas where experts genuinely disagree — not just preference differences but substantive differences in judgment about what to do in specific situations. These should be documented as conditional selections with different conditions, not resolved by majority vote. The disagreement itself is important information about the task's difficulty.

**Category 4: Experience-Level Differentiation**
Methods that novices use and experts don't (scaffolded, step-by-step approaches) vs. methods that experts use that novices can't yet (integrated, rapid assessments that compress multiple steps). Both should be documented if the capability needs to serve users at different skill levels.

## The Validation Gap Applied to Agent System Capability Development

When building a new agent capability:

**Phase 1: Initial Specification**
- Work with the most knowledgeable available expert
- Use structured elicitation (GOMS-equivalent for procedures, CCI-equivalent for perceptual requirements)
- Explicitly flag all assumptions about available resources, context, and external coordination
- Document what the capability requires but doesn't provide

**Phase 2: Challenge the Assumptions**
- Systematically challenge every assumption: "what if X were unavailable?"
- Run the "what if no tug" questions for every assumed resource
- Identify the equivalent of "it is very rare any type of pier side ship-handling would be conducted without the assistance of a tugboat" in the target domain

**Phase 3: Multi-Expert Validation**
- Present the specification to at least three independent experts with varying experience profiles
- Look specifically for unanimous disagreements (these are the tugboat-equivalent findings)
- Look for cases where every expert immediately does something the model doesn't account for

**Phase 4: Corner Case Elaboration**
- Run the validated model through the 10% of cases that don't fit the standard scenario
- Document which parts of the model hold and which require modification
- Build conditional branches for identified variations

**Phase 5: Live Validation**
- Test the capability in increasingly realistic conditions
- Compare agent behavior to expert behavior on the same scenarios
- Use disagreements between agent and expert as the primary source of capability improvement

The thesis demonstrates that even an experienced practitioner building a model of their own domain will produce an initial model with significant structural gaps. The validation process is not quality assurance — it is a necessary part of specification that cannot be shortcut.

## The Honest Assessment: What Any Single Model Captures

The thesis is admirably clear about the limits of its own product:

> "The resulting GOMS-like representations of the tasks used by a conning officer to get a ship safely underway from a pier and moored safely to a pier successfully represent the simple, generic scenario and in no way depicts every possible method that could have been utilized." (p. 114)

This is the right epistemic stance for any capability specification. Every model represents a specific scenario at a specific grain of detail. Claims about generality require validation across multiple scenarios. Claims about completeness require validation against independent experts who will surface the missing elements. The appropriate confidence level in any initial model is: "correct for the scenarios validated, incomplete for the range of real-world situations."

For agent system documentation, this means: capability reference documents should specify *what scenarios they were validated against*, not claim general validity. The scope of applicability is a critical piece of documentation.
```

### FILE: emergency-preparedness-and-failure-mode-classification.md
```markdown
# Emergency Preparedness: Classifying Failure Modes Before They Occur

## The Restricted Maneuvering Doctrine as a Design Pattern

Naval operational doctrine includes a specific configuration called "Restricted Maneuvering" — a state the ship enters before pier-side evolutions, characterized by maximum redundancy in critical systems. The doctrine deserves careful attention because it embodies a design philosophy that translates directly to reliable agent system architecture.

> "Recognizing the fact that new SWOs were not receiving any ship-handling experience prior to reporting to their first command... [the system] requires additional stations to be manned that are normally not manned during standard operations." (p. 33-34)

The Restricted Maneuvering Doctrine does several things simultaneously:

**1. Brings all redundant systems online before they're needed**
> "Prior to getting underway or entering port, all available engines, generators, and steering units are put into operation." (p. 33)

Under normal conditions, redundant engines and steering units sit offline to save fuel and reduce maintenance. During restricted maneuvering, they come online *preemptively* — before any casualty has occurred — so that if a primary system fails, the backup is already running and ready to shift over, rather than cold and requiring startup time.

**2. Pre-positions personnel at emergency stations**
During restricted maneuvering, a qualified helmsman and conning officer are stationed in the after steering room — a backup control station — even though there's no current emergency. They are waiting for a casualty that may never happen.

**3. Changes the failure recovery time from minutes to seconds**
> "Under normal steaming operations, if a ship were to lose an engine or steering unit, it may take several minutes to get a back-up unit running and operational. However, during a restricted maneuvering situation, if a casualty does occur, the configuration of critical machinery allows stand-by units to be automatically shifted over to cover the loss of the primary units." (p. 33)

This is the key: the difference between minutes and seconds in recovery time, in a constrained environment where the ship's momentum will collide it with something if not corrected within seconds. The doctrine recognizes that certain failure modes require faster recovery than reactive startup time allows.

## Pre-Classification of Failure Modes

The thesis catalogs specific pier-side failure modes with their detection signatures and response protocols. This is not a wishlist — it is a pre-computed response plan for anticipated failure modes:

### Loss of Steering
> "This casualty is usually indicated by an alarm on the helm console sounding off and the indicator light to the steering unit in operation flashing on and off. Another indication is that the rudder does not respond to the action of the wheel being turned by the helmsman. The response of the conning officer is to immediately shift to the stand by steering unit. If the rudder still does not respond, an alarm is sounded in the after steering station... If after steering is still unable to control the rudder, the conning officer can use the engines and assisting tugboat to maintain the ship's position while the mechanics fix the problem. However, if it appears that the ship begins to drift towards other ships or shoal water, the conning officer can let go of the anchor to keep the ship from drifting into a hazard." (p. 34)

Notice the structure: **detection signatures → response hierarchy → fallback cascade**

- Detection: alarm AND indicator light AND rudder non-responsiveness (multiple channels)
- Response 1: shift to standby steering unit
- Response 2: if still no response, alarm to after steering for local control
- Response 3: if after steering unavailable, use engines + tug for position maintenance
- Response 4: if drift toward hazard imminent, drop anchor

This is a pre-planned decision tree for a specific failure mode. The conning officer has rehearsed this mentally (and through training exercises) before entering the pier area. When the failure occurs, the response is immediate and does not require improvisation.

### Loss of Propulsion
> "Since the speed of the ship is very slow during pier side evolutions, the only indication that the conning officer may have is the call from the Engineering Officer of the Watch (EOOW) reporting the casualty. In addition, with no water flow over the rudder the ship will rapidly lose its steering capability. Therefore, the only option the conning officer has is to use the assisting tug to hold the ship's position or let go the anchor." (p. 34-35)

This failure mode illustrates *cascading failure*: loss of propulsion leads rapidly to loss of steering (the rudder requires water flow to function). The response plan must account for the cascade, not just the initial failure.

### Loss of Gyrocompass
> "Although this is the primary means for monitoring the ship's heading, the conning officer must shift to using the magnetic compass, which is normally located next to the gyrocompass repeater." (p. 35)

The smallest of the failure modes — the backup is immediately available, always already positioned, and requires no complex switching. This is because this failure mode has been anticipated and its solution pre-engineered into the physical layout of the bridge.

## The Architecture of Pre-Planned Failure Response

The failure mode catalog reveals a consistent architecture:

**1. Anticipation**: Specific failure modes are identified before operations begin. The set of anticipated failures is finite and enumerated.

**2. Detection Specification**: For each failure mode, specific detection signals are identified. Some use a single clear signal (EOOW casualty report). Others use multiple corroborating signals (alarm + indicator light + non-responsiveness). High-consequence failures with subtle onset require multi-signal detection.

**3. Pre-Computed Response**: The response to each failure mode is determined before operations begin, not in the moment of crisis. The conning officer does not improvise during a steering casualty — they execute a pre-planned response that has been rehearsed.

**4. Fallback Cascade**: Responses are layered: try Response A, if that fails try Response B, if that fails try Response C. The fallback sequence terminates at a safe state (anchor deployment) that stops the situation from worsening even if it doesn't resolve the failure.

**5. Recovery Path Separation**: The immediate response (stop the bleeding) and the recovery path (fix the underlying problem) are separated. Loss of steering → shift to standby → position holding via engines/tug is the immediate response. "While mechanics fix the problem" is the recovery path. The conning officer owns the immediate response; engineers own the recovery.

## Cascading Failure Analysis

The loss-of-propulsion scenario illustrates why failure mode analysis must include cascade analysis. A ship loses propulsion. This is manageable at sea with room to maneuver. During pier-side evolution, the same failure rapidly produces:
- Propulsion loss → no water flow over rudder → steering loss
- Propulsion loss → ship still has momentum from prior movement → continues moving toward pier
- Propulsion loss → tug is the only control mechanism remaining → and the tug's line must already be attached

The cascade occurs within seconds. If the response plan only addresses "loss of propulsion" without anticipating the steering cascade, the conning officer will attempt to correct heading with the rudder (which no longer functions) and lose precious seconds before recognizing that the cascade has occurred.

Pre-planned responses for cascades require understanding *dependency chains*: what becomes unavailable when X fails? What becomes unavailable when that thing fails? The cascade analysis should trace at least two hops from each primary failure.

## Implications for Agent System Design

### Pre-Registration of Failure Modes

Agent systems operating in complex environments should pre-register anticipated failure modes before executing high-stakes operations. The registration includes:

```markdown
## Failure Mode: [Name]

### Detection Signatures
- Primary signal: [What indicates this failure has occurred]
- Secondary signals: [Corroborating signals]
- Cascade indicators: [Signals indicating cascade has begun]

### Response Protocol
1. [Immediate response — stop the bleeding]
2. [Fallback if response 1 unavailable]
3. [Fallback if response 2 unavailable]
4. [Safe-state fallback — anchor equivalent]

### Cascade Analysis
- What does this failure cause to fail subsequently?
- How quickly does the cascade occur?
- Does the cascade require different detection/response?

### Recovery Path
- Who is responsible for recovery?
- What is the agent's role during recovery?
- What monitoring is required during recovery?
```

### Pre-Warming Critical Fallbacks

The Restricted Maneuvering Doctrine's principle of bringing redundant systems online before they're needed applies directly to agent systems. For any operation where failure recovery time is critical:

- Secondary API connections should be authenticated and ready before the primary call is made
- Fallback skills should be loaded and warm, not cold
- Backup data sources should have recent cached reads, not stale or empty caches
- Alternative agent routes should be pre-validated, not hypothetically available

The cost of pre-warming is small compared to the cost of discovering a cold fallback when you need it.

### Distinguishing Fast-Onset from Slow-Onset Failures

Some failures manifest over seconds (steering loss cascade). Others manifest over minutes or hours (gradual data quality degradation). The response architecture is different:

**Fast-onset failures** require pre-computed responses executable without deliberation. The response must be immediately available, pre-rehearsed, and require minimal classification effort — because there is no time for classification effort.

**Slow-onset failures** allow monitoring-based detection and deliberative response planning. These can be addressed through monitoring loops with alerting thresholds and planned intervention protocols.

Agent systems should classify each potential failure mode by onset speed and design response architectures accordingly. Treating a fast-onset failure as if it has slow-onset response time available is a systematic architectural error.

### Separating Immediate Response from Recovery Path

The naval pattern — conning officer owns immediate response, engineers own recovery — prevents two failure modes:
1. The conning officer distracted from ship control by trying to fix the engine
2. The engineers trying to manage ship position rather than fix the engine

For agent orchestration: when a component fails, there should be a clear separation between:
- The orchestrator's job (maintain task progress with available resources, via fallback cascade)
- The failed component's recovery job (restore the component to availability)

Mixing these responsibilities produces confused, slow responses. Separating them produces clean, parallel responses.

## The Specific Cost of Not Pre-Planning

> "Although casualties rarely happen during these evolutions, the conning officer must be prepared to handle them in the event they do." (p. 34)

This sentence captures the cost-benefit of failure mode pre-planning precisely. Casualties rarely happen. Therefore the pre-planning overhead is mostly "wasted" in any given evolution. But the expected value calculation includes the magnitude of the consequence when the rare event occurs — and in a restricted maneuvering situation, an unplanned response to a steering casualty can result in catastrophic collision.

High-stakes agent operations — those where failures have severe, fast, irreversible consequences — require pre-planned failure responses regardless of the expected low probability of those failures. The probability threshold for pre-planning is set not by likelihood but by consequence magnitude and reversibility.
```

### FILE: knowledge-elicitation-methodology-for-agent-capability-building.md
```markdown
# Knowledge Elicitation Methodology: From Expert Performance to Agent Capability

## The Central Challenge

Building agent capabilities requires translating expert human performance into machine-executable specifications. This translation faces a fundamental obstacle that Grassi's thesis frames more clearly than most AI literature: experts have the knowledge, but they cannot always access it consciously. The knowledge is real — it reliably produces correct performance — but it is encoded in forms that resist direct verbal report.

> "One area of concern is with the experts themselves. Experts have implicit knowledge of how to perform a task, but they do not always have the explicit knowledge about how or why they perform the way they do." (p. 16)

This is not a problem of willingness or intelligence. It is a structural property of expertise: skills that have been highly practiced are compiled into fast, automatic, perceptual-motor routines that operate below the threshold of conscious access. The expert cannot introspect on them directly any more than you can introspect on how you balance while walking.

> "Knowledge elicitation methods should describe the function served by implicit knowledge in proficient task performance so that it should not appear that explicit knowledge is sufficient for proficient performance." (p. 16)

This is a critical epistemological point: if you only elicit explicit knowledge, you will produce a specification that appears complete but is systematically deficient. The deficiency is invisible because the expert doesn't know what they left out.

## The Critical Decision Method as Elicitation Architecture

The CDM provides a three-phase structure for progressively surfacing both explicit and implicit knowledge:

### Phase 1: Free Recall (Captures Explicit Knowledge)
The expert recounts the entire event without interruption. This captures what the expert consciously owns as "their" knowledge of the task — the science layer, the explicit procedures, the logical sequence.

This phase will produce:
- The major phases of the task
- The standard sequence of actions
- The explicit decision points that the expert is aware of
- The resources and tools the expert consciously uses

What it will miss:
- Deeply automatized cues and triggers
- Infrastructure and coordination that feels "external"
- Context-dependent variations that feel like obvious common sense
- Timing judgments and rate assessments

### Phase 2: Decision Point Probing (Surfaces Tacit Knowledge)
The interviewer retells the story and probes at each decision point: "What were you thinking here? What did you notice just before you did X? What would have been different if Y had happened?"

This phase surfaces:
- The first layer of tacit knowledge (things the expert knows but didn't think to mention)
- The conditions that trigger different methods (the content of selection rules)
- The timing signals that indicate when to transition between phases
- The indicators that something is going wrong

### Phase 3: What-If Questioning (Surfaces Assumptions and Alternatives)
The interviewer poses counterfactual scenarios: "What if X were different? What if Y were unavailable? What if you noticed Z at this point instead?"

This phase surfaces:
- Assumptions the expert was making (the tugboat gap was found here)
- The range of methods available at each decision point (not just the one the expert used)
- The conditions that make the expert deviate from standard procedure
- The boundaries of the expert's strategy (what would cause them to abandon the approach entirely)

> "In addition to the probe questions, the elicitor poses various 'What if' questions to identify any inaccuracies, differences between experts and novices, and any alternative methods." (p. 22)

## The Model/Validation Sequence

Grassi's methodology follows a specific sequence that should be the template for agent capability development:

**Step 1: Build initial model from documents and one expert**
Review existing documentation (training manuals, standing orders, prior task analyses). Use one knowledgeable expert to elaborate what documentation doesn't cover. This produces an initial GOMS-like model.

**Step 2: Externalize the model**
Produce a written/diagrammed specification that can be reviewed independently. The externalization is critical — implicit models in one person's head cannot be validated.

**Step 3: Validate with multiple independent experts**
Use CDM process with each validator. Compare their account to the initial model. Look for:
- Anything the validator immediately does that the model doesn't include
- Any phase the validator finds implausible or incorrect
- Any method the validator uses that the model doesn't offer as an option

**Step 4: Reconcile discrepancies**
Distinguish between:
- **Universal discrepancies**: Every validator agrees the model is wrong. Fix these unconditionally.
- **Majority discrepancies**: Most validators agree; some don't. Investigate whether this is an experience-level artifact or a genuine alternative.
- **Individual variations**: Each validator has different preferences. Document as alternative methods with selection rules.

**Step 5: Validate the revision**
Bring the revised model back to validators and confirm the revisions correctly addressed their concerns.

## Criteria for Selecting Validators

The thesis takes participant selection seriously:

> "Careful consideration was taken in selecting the participants for the validation process... Therefore, it was determined that the participants must at least have the following criteria: 1) that they have experience with twin or multiple-screw ships, 2) that they have at least 10 experiences of getting a ship underway or mooring to a pier, and 3) that they have recently departed from an at-sea tour onboard an operational ship." (p. 47)

The criteria are not arbitrary. Each addresses a specific threat to validity:
- "Twin or multiple-screw ships": The model represents a twin-screw ship. Validators with single-screw experience would be validating against a different context.
- "At least 10 experiences": Sufficient experience to have developed robust expertise beyond the novice stage, but varied enough to have encountered multiple situations.
- "Recently departed at-sea tour": Current experience, not memory of practice from years ago that may have been superseded by evolving doctrine.

For agent capability validation, the equivalent criteria should address:
- Domain specificity: Validators whose experience matches the scope of the capability
- Experience depth: Validators with sufficient exposure to have developed genuine expertise
- Experience recency: Validators whose practice reflects current best practices, not historical ones
- Experience diversity: Validators from different contexts, tools, frameworks, or organizational cultures to surface context-specific assumptions

## Visual Aids and Physical Grounding

The thesis uses physical models (pier and ship built from foam core) as aids during the validation process:

> "A small model of a pier area and a ship were constructed out of 'foam core,' or poster board and brought to each of the knowledge elicitation phases. The model was used as a visual aid for the participants as they walked through the pier side evolution and was successful in helping them visualize the scenario." (p. 47-48)

This is not cosmetic. Complex, multi-step, spatially-embedded tasks are poorly served by purely verbal elicitation. When the expert can manipulate a physical representation of the situation, they are able to think through the task more concretely and comprehensively — because the physical model provides the perceptual cues that trigger the tacit knowledge.

The model also served a specific methodological function:
> "The model was advantageous in that it provided a quick and efficient way for the interviewer to reset the problem or stop the expert's account of the evolution at any given position of the ship." (p. 48)

The ability to freeze the scenario at a specific state — "let's talk about exactly this moment, when the ship is at this position relative to the pier" — is critical for probing specific decision points. Without the ability to freeze and revisit, the expert's narrative flows past critical moments before the interviewer can probe them.

For agent capability development: use scenario simulations, mockups, or concrete test cases as the substrate for knowledge elicitation. Abstract verbal discussion of "how would you handle X?" produces thinner knowledge than "here is X — walk me through exactly what you would do and why."

## Grain of Analysis and Appropriate Detail Level

One of GOMS's practical advantages is the ability to adjust the level of detail to match the purpose:

> "Depending on the desired level of detail needed from the task analysis, which Card, Moran, and Newell referred to as the 'grain of analysis,' the GOMS model can be composed having more or less detail." (p. 21)

The thesis demonstrates three grains:
- **Unit task level**: Sufficient for resource planning, task routing, and high-level sequencing
- **Functional task level**: Sufficient for training curriculum design and simulator scenario development
- **Detailed task level**: Required for implementing the actual capability or building an automated system that performs the task

For agent systems, the appropriate grain depends on the purpose:
- **Routing decisions** (should this task go to Agent A or Agent B?) → Unit task level
- **Capability documentation** (what can this skill do and when?) → Functional task level
- **Skill implementation** (how should this skill execute?) → Detailed task level

Specifying everything at the detailed level is expensive and often unnecessary. Specifying everything at the unit level is insufficient for implementation. The grain should match the decision being made.

## When This Methodology Is Hard to Apply

The CDM/GOMS methodology works best when:
- Experts perform the task regularly and recently
- The task has a physical or observable component (something happens in the world that can be pointed to)
- Tasks have identifiable decision points (moments where different actions could be taken)
- The population of experts is accessible and willing to participate

It is harder to apply when:
- Expertise is very rare or experts are inaccessible
- Tasks are highly abstract or entirely internal to the expert's cognition
- Tasks vary so much by context that a generic model is difficult to construct
- The knowledge is genuinely novel and no expert has established reliable practice

For agent systems operating in genuinely novel domains (new problem types, unusual task combinations, frontier capabilities), the CDM/GOMS approach requires modification: the "expert" may be an idealized reasoner rather than an existing practitioner, and the validation must use synthetic scenarios and theoretical analysis rather than experienced practitioners' accounts.

## Practical Template: Capability Development Interview Guide

For any WinDAGs skill development, the knowledge elicitation interview should follow this structure:

**Pre-interview**:
- Send the expert the scenario specification in advance
- Ask them to bring any notes, mental models, or reference materials they'd want access to during the task
- Explain that you want their real-world practice, not the textbook answer

**Phase 1 - Free Recall (15-20 minutes)**:
- "Walk me through how you'd perform [task] in [specified scenario]"
- Do not interrupt except to ask clarifying questions about what was just said
- Record everything; don't filter yet

**Phase 2 - Decision Point Probing (20-30 minutes)**:
- Replay the expert's account phase by phase
- At each action: "What did you notice just before you did that? What triggered that choice?"
- At each assessment: "How did you know that? What did you look at? What would a wrong answer look like?"
- At each selection: "Why that method rather than [alternative]?"

**Phase 3 - What-If Questioning (15-20 minutes)**:
- "What if [key resource] wasn't available?"
- "What if [common condition] was different?"
- "What would make you stop and start over?"
- "What could go wrong that would change your approach?"

**Post-interview**:
- Produce a written specification from the interview
- Return for a second session to walk through the specification with the expert
- Look explicitly for: "This is right but incomplete," "This is in the wrong order," "This doesn't handle [case]"

This methodology, applied to multiple experts with the selection criteria described above, produces capability specifications dramatically more complete and reliable than single-expert, single-session elicitation.
```

### FILE: situation-awareness-and-the-conning-officers-mental-model.md
```markdown
# Situation Awareness: Building and Maintaining a Mental Model Under Time Pressure

## The Mental Picture as Primary Instrument

The most sophisticated cognitive achievement in pier-side ship-handling is not any individual action — it is the ongoing maintenance of an accurate "mental picture" of the tactical situation. Grassi's thesis refers to this repeatedly, always in language that suggests it is the foundation on which all decision-making rests:

> "With the conning officer positioned on the bridgewing, he begins to make a mental picture of situation by identifying pertinent visual cues. By walking to both sides of the ship and viewing the surrounding area, the conning officer not only gains visual references to neighboring ships, but he is also able to assess the environmental effects." (p. 63)

The mental picture is not a snapshot — it is a dynamic model that integrates:
- The ship's current position relative to the pier, neighboring vessels, channel markers, and navigational hazards
- The ship's current velocity vector (speed, direction, rate of rotation)
- The environmental forces acting on the ship (wind direction and magnitude, current direction and strength)
- The predicted trajectory given current helm and engine settings
- The available room to maneuver in each direction
- The locations and states of all team members and external resources (tug, harbor pilot, line handlers)

This mental model must be continuously updated as each of these elements changes. And it must be accurate enough to support confident, time-critical decisions — "swing the stern now" or "back down harder" — with minimal tolerance for error.

## How the Mental Model Is Built

The mental model is constructed through structured observation. Before any maneuvering begins, the conning officer performs a deliberate assessment:

**Position assessment**:
> "goal: Determine_Distance_Between_Bow_And_Closest_Obstruction
>   [select: Visually judge distance
>            Use distance reported by surface radar
>            Receive estimated distance from bow watch
>            Confer with commanding officer, pilot, or OOD]" (p. 63)

Each dimension of the tactical situation is assessed through multiple channels and cross-referenced. The result is not a precise measurement — it is a *calibrated estimate* with known uncertainty bounds. The expert knows "the bow is about 50 feet from the pier, plus or minus 10" rather than needing to know "47.3 feet."

**Environmental assessment**:
The conning officer physically repositions — walks to both bridge wings — to get views that update different aspects of the mental model. The port bridge wing gives the best view of the mooring side; the starboard bridge wing provides a different perspective. Physical repositioning is not incidental; it is a deliberate data acquisition strategy.

**Reference frame establishment**:
Before the ship moves, the conning officer establishes reference points that will serve as fixed anchors for subsequent motion assessment:

> "Used to determine the forward or aft motion of the ship. The conning officer will select a fixed point on the pier, such as a crate or paint marking, and will watch to see if it develops some sort of relative motion." (CCI Table 8)

The reference point converts absolute motion (hard to perceive from aboard a moving object) into relative motion (easy to perceive). This is a deliberate cognitive strategy, executed at the beginning of the evolution, that pays dividends throughout.

## How the Mental Model Is Maintained

Once established, the mental model must be updated continuously. This happens through:

**Recurring monitoring cycles**: The GOMS model explicitly flags `Complete_Assessment_Of_Ship's_Movement/Position` as a recurring goal — it appears multiple times throughout the evolution, not once. This is because the mental model's accuracy degrades over time as conditions change. Regular, systematic refresh is required.

**Anticipatory monitoring**: Before ordering an action, the conning officer predicts the expected response. After ordering the action, they monitor for the predicted response. If the actual response deviates from the predicted response, this is a signal that either the mental model is wrong or something unexpected has happened in the environment.

> "After giving these orders, the conning officer observes the response of the ship by visually watching the space between the pier and the stern. If after a few moments there is no noticeable change, or if the stern begins to swing in towards the pier, the conning officer will make adjustments to his engines." (p. 66)

The structure here is: **command → predict → observe → compare → adjust**. The comparison step is where the mental model is tested and updated.

**Distributed sensing**: The conning officer does not monitor the entire situation alone. The bow watch reports distances. The stern watch reports distances. The navigator provides position reports. The OOD monitors for surface contacts. The pilot provides local knowledge. The total mental picture is assembled from multiple distributed observers, each monitoring a specific slice of the environment.

> "The conning officer has the ability to verify the accuracy of his visual assessment on distances in a variety of ways. One way is to ask the officers stationed on the bow and stern to visually estimate the distances from their vantage point." (p. 63)

The distributed sensing network functions as a extended perceptual system — the conning officer's mental model is fed by sensors at different locations than the conning officer's physical position.

## The Moment When Mental Model and Reality Diverge

The most dangerous moment in pier-side ship-handling is when the conning officer's mental model diverges from the actual situation — when they believe the stern has cleared the pier but it hasn't, when they believe the rate of swing is manageable but it has accelerated, when they believe the tug is available but it has lost its line.

Several features of the expert's approach are specifically designed to catch divergence before it becomes catastrophic:

**Multiple independent confirmations for high-consequence states**: The closer the ship gets to the pier, the more frequently the conning officer checks the critical distances and the more independent channels they use. Assessment frequency scales with consequence.

**Explicit comparison with expectations**: After every action, there is a monitoring pause to confirm the action produced the expected effect. Deviation from expectation is a divergence signal.

**Physical repositioning for fresh perspective**: Moving from bridge wing to pilot house and back provides a new viewing angle on the same situation — sometimes revealing aspects of the situation that were invisible from the previous position.

**Consultation with independent observers**: Asking the stern watch, the bow watch, the OOD, and the pilot for their assessment provides independent data points that can reveal divergence the conning officer's primary perspective misses.

**Conservative assessment bias**: When uncertain, the conning officer assumes worse conditions than observed — more current, less clearance, faster momentum. This creates a built-in margin between actual conditions and the threshold for corrective action.

## What "Anticipate" Means in Expert Practice

The thesis uses the word "anticipate" in a specifically technical sense:

> "He must be able to anticipate what action must be taken next and immediately recognize when something appears incorrect." (p. 36)

Anticipation in expert ship-handling is not prediction of the future from scratch. It is the recognition that the current state of the mental model implies a specific trajectory — and that if the trajectory is followed without intervention, a specific undesired state will result. Anticipation is the recognition of an *implication* of the current mental model.

This is why the mental model must include not just current state but *dynamics* — not just "where is the ship" but "where is the ship going and at what rate." A ship that is 50 feet from the pier and moving away is in a very different situation than a ship that is 50 feet from the pier and moving toward it at 2 knots. The state description is identical in one dimension; the dynamic state is opposite.

Expert anticipation is computationally efficient because it doesn't reason from first principles at each moment — it maintains a running estimate of the trajectory and monitors for deviations from an acceptable trajectory. When the trajectory begins to approach an unacceptable region, intervention is triggered before the boundary is crossed.

## Agent System Implications

### Situational Awareness as a First-Class Concern

Most agent task specifications focus on *what to do*. The ship-handling expert's practice suggests that *maintaining an accurate model of the current situation* is at least as important as knowing what to do. An agent with perfect procedural knowledge but inaccurate situation assessment will execute the right actions at the wrong times or in the wrong conditions.

For complex agent tasks, the specification should include:
- What model of the current state the agent maintains
- How frequently the model is updated
- Which signals trigger model updates
- How the agent detects divergence between its model and actual state
- What the agent does when divergence is detected

### The Command-Predict-Observe-Compare-Adjust Loop

The conning officer's monitoring pattern — command → predict → observe → compare → adjust — is a universal pattern for reliable action in uncertain environments. For agent skills that invoke external actions (API calls, database writes, file system operations, external service calls), this loop should be explicitly implemented:

1. **Command**: Invoke the action
2. **Predict**: Specify the expected outcome (in the skill specification, not improvised at runtime)
3. **Observe**: Monitor the actual outcome through channels independent from the action invocation
4. **Compare**: Detect deviation between predicted and observed
5. **Adjust**: Invoke correction protocol when deviation exceeds threshold

Most agent implementations do only steps 1 and 3. Steps 2, 4, and 5 are where reliability is built.

### Distributed Sensing and Aggregation

The conning officer's distributed sensing network — bow watch, stern watch, navigator, OOD, pilot — maps onto a multi-agent sensing architecture. In agent systems, this corresponds to:
- Parallel information gathering from multiple specialized sources
- A synthesis agent that aggregates and reconciles the gathered information
- A confidence weighting scheme that accounts for the reliability of each source in the current context
- An escalation protocol when sources disagree beyond a threshold

The synthesis function — building a coherent situational model from multiple partial, sometimes conflicting inputs — is not trivial. It is one of the more cognitively demanding aspects of the conning officer's role, and it requires explicit design in agent systems.

### Conservative Bias When Uncertain

The expert's tendency to assume worse conditions than observed when uncertain is a specific epistemic policy that can be directly implemented: when multiple channel readings disagree about a state, use the more conservative (more dangerous) estimate for planning purposes.

This policy has a cost: sometimes it leads to more cautious action than necessary, wasting time or resources. But its benefit — avoiding the catastrophic consequence of acting on an overly optimistic estimate — typically justifies the cost in high-consequence domains.

For agent systems operating in consequential domains, the uncertainty-to-action policy should be explicit: "when uncertain about [state X], assume [more conservative value] for the purpose of planning [action Y]."
```

### FILE: the-art-science-gap-transfer-to-simulation.md
```markdown
# The Gap Between Knowing and Doing: Why Simulators and Agent Systems Need High-Fidelity Perceptual Environments

## The Fundamental Problem of Transfer

A surface warfare officer can read every chapter of Crenshaw's *Naval Shiphandling*, memorize the physics of propeller side-force, and pass a written examination on the six forces affecting a ship — and still, when given the conn for the first time, "end up being a 'parrot' where all they do is repeat orders given by the OOD or commanding officer."

The knowledge is present. The performance is absent. This gap — between knowing and doing — is not a failure of intelligence or motivation. It is a structural feature of how complex skilled performance is encoded in the human cognitive system.

Grassi's thesis is fundamentally a study of this gap, and its methodology is an attempt to bridge it through a combination of explicit procedural documentation (GOMS) and perceptual signal cataloguing (CCI). The bridge is imperfect — the thesis acknowledges that even the completed analysis "in no way depicts every possible method that could have been utilized" — but it represents the most systematic approach available given the constraints.

## What Creates the Gap

The gap exists because knowing and doing engage different cognitive systems:

**Declarative knowledge** (knowing-that): "A backing bell on the outboard engine will swing the stern toward the pier." This is propositional. It can be stated, stored as text, tested in written examination, and transmitted by reading.

**Procedural knowledge** (knowing-how): The capacity to recognize "this is the moment for a backing bell on the outboard engine" from perceptual signals, execute the verbal order in the correct form, coordinate it with other concurrent actions, and monitor its execution — all under time pressure, with attention simultaneously allocated to ten other developing situations.

The first can be transmitted without practice. The second cannot. The SWOS classroom produces declarative knowledge. The bridge produces procedural knowledge. The simulator is an attempt to produce procedural knowledge without the full risk of the bridge.

## What Simulators Must Reproduce

For a simulator to actually build procedural knowledge, it must reproduce the perceptual environment with sufficient fidelity that the perceptual-motor skills trained in simulation *transfer* to the real environment. The thesis makes this requirement explicit:

> "The greatest challenge of the COVE system is to accurately display the visual cues a conning officer would utilize in the real environment." (p. 10)

The critical word is *visual cues*. Not "the physics of ship handling" — that can be simulated accurately with a mathematical model. Not "the standard commands" — those can be drilled verbally without any simulator. The challenge is replicating the specific visual (and auditory) signals that experts have learned to interpret as indicating specific states of the world.

If the simulator does not reproduce these cues with sufficient fidelity:
- The trainee cannot practice the perceptual discrimination skills the expert uses
- Cues learned in the simulator will not transfer to the real environment (because they look different)
- The trainee will build procedural knowledge that works in the simulator but not on the ship

This is the problem of *perceptual fidelity* — and it is the hardest part of simulation design, because it requires an accurate inventory of *which perceptual signals* experts actually use, not just the physics that produces them.

The CCI is the answer to this requirement: it provides a validated inventory of the specific perceptual signals that expert ship-handlers actually use, in sufficient detail to allow simulation designers to know what they must reproduce.

## Presence and the Feeling of Reality

The thesis introduces a concept that is central to simulation effectiveness: *presence* — the sense of actually being in the simulated environment rather than observing it.

> "Presence is often referred to as the ability for one to feel that they are really in the world that is being represented by the computer other than their true physical location." (p. 10-11)

The head-mounted display (HMD) used in COVE enhances presence compared to flat-screen simulators by providing a full 360-degree field of view that matches the conning officer's actual visual environment. This is not just a comfort feature — presence is functionally important because:

1. **It activates the right cognitive systems**: High presence activates the same perceptual-motor engagement as the real task. Low presence (sitting at a desk, watching a screen) activates observer mode rather than performer mode.

2. **It enables transfer**: Skills trained in a high-presence environment are more likely to transfer to the real environment because the encoding conditions are similar.

3. **It allows realistic errors**: In a low-presence environment, trainees know they're safe and take risks they wouldn't take in reality. In a high-presence environment, the normal autonomic stress responses activate, providing more realistic conditions for learning error recognition and recovery.

For agent systems, the presence concept translates to *environmental fidelity*: an agent trained and evaluated only on sanitized, simplified inputs will perform differently when deployed in noisy, complex, real-world conditions. The gap between training environment and deployment environment is the agent equivalent of the presence gap.

## The Intelligent Tutor Requirement

The COVE project specification includes a requirement that illuminates a different dimension of the knowing/doing gap:

> "The COVE system is being developed to provide state of the art intelligent tutor techniques that will allow multiple students at individual stations to be evaluated simultaneously. The intelligent tutor aspect of COVE would not only allow the students to use the simulator at their own convenience, but would also provide immediate feedback and constructive criticism." (p. 11)

The intelligent tutor replaces the human expert observer who, in traditional training, monitors the trainee's performance and provides corrective feedback. Without feedback:
- Trainees don't know when their perceptual assessments are wrong (they may "see" the correct state but report the wrong conclusion)
- Trainees can't calibrate their confidence (they may be confident and wrong, or uncertain and right)
- Bad habits learned early can entrench because no one corrects them

But building an intelligent tutor requires knowing *what the expert is looking for* — which is exactly what the GOMS + CCI combination provides. The tutor can evaluate trainee performance against the expert model documented in the CCI: "the trainee said the stern was clear, but the CCI indicates that a competent officer would check both the direct visual separation and the stern watch report. The trainee only checked one channel. Flag this as a monitoring deficiency."

For agent systems: evaluation metrics derived from expert behavior models (GOMS + CCI) enable more diagnostically precise capability assessment than simple pass/fail outcome metrics. An agent that reaches the right answer for the wrong reasons (using unreliable signals, skipping verification steps) is not performing correctly even if the outcome is correct in easy cases. It will fail when conditions degrade.

## The Seaman's Eye: What Practice Builds

The concept of "seaman's eye" — the sailor's analog to the pilot's "hand-eye coordination" or the surgeon's "feel" — appears throughout the thesis as the target of ship-handling training:

> "One of the primary requirements defined by SWOS is to have a 'performance-driven system' that trains ship handlers in acquiring a seaman's eye." (p. 10)

What is seaman's eye? It is the integrated perceptual-motor-cognitive system that:
- Continuously integrates perceptual signals into an accurate mental picture
- Anticipates the implication of the current situation's trajectory
- Triggers appropriate responses at the right moment with the right intensity
- Recovers gracefully from errors without losing the overall picture

This is not a verbal skill. It is not a logical skill. It is a trained perceptual-motor system that operates largely below the threshold of conscious deliberation. It is built through thousands of repetitions in varied conditions.

The thesis makes no claim that its task analysis substitutes for seaman's eye. The claim is more modest: the task analysis identifies what the simulator must reproduce in order to provide the conditions in which seaman's eye can be developed through practice.

## Transfer: The Real Test

The ultimate test of any simulator — or any agent training methodology — is *transfer*: do the skills built in the training environment actually generalize to the deployment environment?

> "The primary goal of the VETT research is to provide a testbed system that can be used to demonstrate how well ship-handling skills trained in a virtual environment transfer to real world situations." (p. 9)

Transfer is not guaranteed. It requires:
1. Sufficient perceptual fidelity that the signals used in training match the signals present in deployment
2. Sufficient scenario variety that the trainee has encountered a range of conditions, not just the standardized scenario
3. Sufficient difficulty that the trainee has experienced and recovered from errors, building error-recovery skills
4. Sufficient repetition that procedural knowledge is encoded robustly, not fragily

For agent systems, the parallel concerns are:
1. **Input distribution fidelity**: Is the distribution of inputs in testing similar to the distribution in deployment?
2. **Scenario diversity**: Has the agent been tested across a range of conditions, or only on standardized benchmark cases?
3. **Error exposure**: Has the agent been tested in conditions where errors occur and recovery is required?
4. **Robustness under degraded conditions**: Has the agent been tested with missing, noisy, or conflicting inputs?

The gap between benchmark performance and deployment performance in AI systems is exactly the same gap as between classroom knowledge and bridge performance — the training environment is simplified, sanitized, and standardized in ways that do not reflect the complexity of the deployment environment. The CCI + GOMS methodology, applied to agent development, is one approach to making training conditions more systematically aligned with deployment conditions.

## Recommendations for Practice: Building Agent Capabilities That Transfer

1. **Document the deployment perceptual environment explicitly**: What inputs will the agent actually receive? What will they look like when degraded, ambiguous, or conflicting? Build test cases that match this distribution.

2. **Identify the CCI-equivalent for each decision node**: For each point where the agent must classify a situation before acting, document the specific signals available in deployment. Ensure the agent's decision logic uses signals that are actually available in deployment, not only in training.

3. **Test in conditions of graduated complexity**: Begin with clean, simple cases; progress to noisy, complex, ambiguous cases. Don't report only the clean-case performance.

4. **Test error recovery explicitly**: Deliberately inject errors and monitor recovery quality. An agent that cannot recover gracefully from its own errors (or from errors in its inputs) will degrade badly in deployment.

5. **Measure the right things**: Outcome metrics (did the task succeed?) capture the gross performance. Process metrics (were the right signals checked? in the right sequence? with the right verification steps?) reveal whether the right skills are being built. Both are required.

6. **Validate transfer, not just performance**: A capability that works perfectly on test scenarios but fails on slight variations of those scenarios has not transferred — it has memorized. Transfer requires generalization to genuinely novel inputs within the scope of the intended task.
```

---

## SKILL ENRICHMENT

- **Task Decomposition**: The GOMS framework directly enriches decomposition by providing a principled structure for hierarchical goal trees with selection rules. Most task decomposition approaches produce flat lists or simple dependency graphs; GOMS produces conditional, nested trees where each level has explicit branching logic. The CCI concept forces specification of *how the agent will know which branch to take* — the most commonly missing element in decomposition documentation.

- **Code Review**: The CCI concept applies directly — expert code reviewers have an implicit inventory of signals that trigger concern (naming pattern anomalies, suspicious control flow, missing validation, etc.). Making this CCI explicit would allow code review agents to systematically check for the signals experts notice tacitly, rather than only flagging the patterns explicitly documented in style guides.

- **Security Auditing**: The failure mode classification methodology (pre-register expected failure modes, document detection signatures, pre-compute response cascades) should be applied to threat modeling. Security audits built on a GOMS-equivalent task analysis of attacker behavior, with CCIs for attack detection signals, would be more comprehensive than checklist-based approaches.

- **Agent Orchestration**: The distinction between sequential goals, recurring monitoring loops, and event-triggered responses is directly applicable to orchestration architecture. Orchestrators that represent all goals as sequential DAG nodes miss the monitoring loops that make complex execution robust. The emergency response cascade structure (Response A → Response B → Response C → safe-state fallback) is a direct template for orchestrator failure handling.

- **Debugging**: The multi-channel sensing approach applies directly to diagnostic reasoning. Expert debuggers use multiple independent signals to triangulate the location of a bug — runtime error messages, log patterns, state inspection, behavioral symptoms, test failure patterns. The CCI framework would make these diagnostic signals explicit, enabling more systematic debugging agent behavior.

- **Architecture Design**: The Restricted Maneuvering Doctrine maps directly to high-stakes deployment architecture: bring redundant systems online before they're needed, pre-position personnel at failure response stations, separate fast-onset from slow-onset failure response. Architecture review agents enriched with this framework would identify single points of failure more systematically.

- **Frontend Development**: The "presence" concept and the emphasis on perceptual fidelity translate to UX design — the signals a user interface provides to users should match the perceptual vocabulary users have developed. Interfaces that require users to re-learn their perceptual vocabulary produce the "parrot" problem: users who know the theory but can't act on it fluently.

- **Knowledge Base / Documentation**: The validation gap discovery (the tugboat problem) should inform how documentation is created and validated. Any capability specification built from a single author's knowledge will systematically omit elements that the author treats as obvious background. Multi-expert validation of documentation is not editorial quality assurance — it is a necessary part of content completeness.

---

## CROSS-DOMAIN CONNECTIONS

- **Agent Orchestration**: The GOMS hierarchy — goals, operators, methods, selection rules — is a direct template for orchestration tree design. The distinction between recurring goals (monitoring loops) and sequential goals (one-time sub-tasks) directly addresses a common architectural gap in DAG-based orchestrators, which treat all nodes as sequential. The Restricted Maneuvering Doctrine provides a template for pre-warming redundant systems before high-stakes operations.

- **Task Decomposition**: The three-level grain of analysis (unit, functional, detailed) provides a principled framework for decomposition depth. Decomposition at the unit level is sufficient for routing; at the functional level for capability documentation; at the detailed level for implementation. The selection rule structure shows how decomposition must include conditional branching logic, not just sequential dependencies.

- **Failure Prevention**: The pre-classification of failure modes with detection signatures and response cascades is a direct transfer. The cascade analysis (what does this failure cause to fail subsequently?) prevents the common error of planning responses only for primary failures while ignoring cascade effects. The command-predict-observe-compare-adjust loop is a general pattern for detecting divergence between expected and actual outcomes before they become failures.

- **Expert Decision-Making**: The science/art distinction is the most