# Cognitive Work Analysis: Mapping Constraints That Define the Solution Space

## The Formative Philosophy

Among the five major CSE frameworks described in Militello et al. (2009), Cognitive Work Analysis (CWA) offers what may be the most distinctive and transferable methodology: a *formative* approach to understanding work domains that focuses not on what workers do, but on what work *requires*.

The distinction is crucial. Analyzing what workers do produces descriptive models of current practice — useful for identifying training needs or designing training simulators, but limited for designing genuinely new systems. Current practice reflects the constraints of current tools, current organization, and current understanding. It cannot reveal what might be possible with different support.

Analyzing what work *requires* — the constraints within which workers must operate — reveals the underlying structure of the problem domain that any solution must address, regardless of what form that solution takes. This is the formative philosophy: understand the problem space before constraining the solution space.

CWA "advocates a formative approach in which work and its functional structure are examined in order to identify the constraints within which workers must operate." (p. 2) These constraints are not arbitrary — they reflect the physics of the domain, the logical relationships between goals and actions, the information that is and isn't available, the time pressures that bound decision-making, and the organizational structures that distribute responsibility.

## The Abstraction-Decomposition Matrix

The primary representational tool of CWA is the **abstraction-decomposition matrix** — a two-dimensional framework for mapping the structure of a complex work domain.

The **abstraction** dimension maps the domain at different levels:
- **Functional purpose**: The highest-level goals and values of the system (Why does this system exist?)
- **Abstract functions**: The fundamental principles and laws governing the domain (What must always be true?)
- **Generalized functions**: The capabilities and processes that serve those principles (What must the system be able to do?)
- **Physical functions**: The specific behaviors of specific components (What do individual elements actually do?)
- **Physical form**: The concrete, observable characteristics of the system (What does it look like?)

The **decomposition** dimension maps the system at different levels of granularity — from the whole system down to individual components.

The resulting matrix provides a map of the domain at every level of abstraction and granularity. This map reveals something that neither level alone can show: how changes at one level constrain and are constrained by all other levels. A design decision at the level of physical form (the layout of a display) has implications at the level of functional purpose (the plant operator's ability to maintain safe operating conditions) that can only be traced through the intervening levels.

## Why This Matters: The Constraint Revelation

The value of constraint mapping is not primarily descriptive — it is *generative*. By mapping the constraints of the domain, CWA reveals:

**What must be true in any solution**: Some constraints are fundamental to the domain (the physics of nuclear reactions, the temporal structure of air traffic, the logical dependencies between decision inputs and decision outputs). No solution can violate these constraints. Identifying them early prevents design investment in approaches that will ultimately fail.

**What can vary across solutions**: Not all constraints are fundamental. Some reflect current practice, current technology, or current organizational structure. These are *contingent* constraints — they can be changed as part of the solution design. Identifying contingent constraints reveals design freedom that current-practice analysis obscures.

**What information is required for effective performance**: The constraints map reveals what information must be available to decision-makers at what level of abstraction and at what time. This directly specifies information display requirements without requiring a prescription of how decisions should be made.

**Where the hard cases live**: Constraints create boundaries. The hard cases — the situations where expert judgment is most needed and where failure is most likely — are at the boundaries. CWA makes these boundaries visible.

## The Decision Ladder

Complementary to the abstraction-decomposition matrix is the **decision ladder** — a representation of the cognitive processes by which domain actors move between states of knowledge and states of action.

The decision ladder maps:
- The information states an actor can be in (having detected a situation, having formed a diagnosis, having identified a target state, etc.)
- The action states an actor can produce (observing, diagnosing, defining target state, planning, executing, etc.)
- The cognitive processes that connect them
- The shortcuts (heuristics) that expert performers use to bypass the full deliberate process when pattern recognition enables rapid response

The decision ladder is particularly powerful for revealing where expert performers deviate from the normative process — where they use pattern recognition to jump from cue detection directly to action, bypassing explicit diagnosis and planning. These shortcuts are the signature of expertise, and they are also the locations where errors occur when a recognized pattern turns out not to match the actual situation.

## The Applied Cognitive Work Analysis Extension

Elm and colleagues developed Applied Cognitive Work Analysis (ACWA) specifically to address a gap in CWA: while CWA produces rich domain models, it doesn't prescribe how those models translate to design specifications.

ACWA "articulates steps and corresponding artifacts to transform the cognitive demands of a complex work domain into graphical elements of an interface." (p. 5) The key insight: the abstraction-decomposition matrix and decision ladder don't just describe the domain — they specify the information that must be available to the operator at each decision point, in a form that supports the cognitive processes required.

This translation — from constraint map to design specification — is the engineering payoff of CWA.

## Application to AI Agent Systems

### Constraint Mapping Before Skill Design

The CWA formative philosophy has direct application to skill design in agent systems. Before designing a skill, perform constraint mapping:

**Functional purpose**: What is this skill ultimately for? What higher-level goal does it serve? What value does it create?

**Abstract functions (domain principles)**: What are the fundamental principles of the domain this skill operates in? What must always be true? What can never be violated? A code review skill must respect that valid code must compile and produce correct outputs — these are not negotiable constraints. A summarization skill must preserve logical accuracy — not a constraint that can be traded off for brevity.

**Generalized functions (capabilities)**: What must the skill be able to do in all cases? What are the core capabilities that define the skill? What distinguishes reliable performance from unreliable performance?

**Physical functions (specific behaviors)**: What does the skill actually do in specific situations? What are the characteristic behaviors? What are the edge cases?

**Physical form (output characteristics)**: What does the skill's output look like? What are its format, length, confidence, and scope characteristics?

This constraint map reveals what the skill must be able to do (functional purpose through generalized functions) and what it actually does (physical functions and form). The gap between them is the failure space — the situations where the skill's actual behavior doesn't meet the domain's fundamental requirements.

### Identifying What Must Be True in Any Agent Solution

For complex multi-agent problem-solving, constraint mapping can be applied to the task domain before designing the agent pipeline:

1. Map the functional purpose: What is this orchestration ultimately trying to achieve?
2. Identify abstract functions: What domain principles constrain any valid solution? (Data privacy constraints, logical consistency requirements, temporal dependencies, resource limits)
3. Identify generalized functions: What capabilities must the system have in all cases, regardless of specific approach? (Verification that outputs are grounded in available data, confirmation that actions are within authorized scope)
4. Identify contingent constraints: Which constraints reflect current tools or approaches and could be changed if a better approach existed?

This constraint map specifies what any valid agent pipeline must do — independent of which specific skills are used. It serves as the evaluation framework for proposed decompositions: does this pipeline satisfy all the fundamental constraints?

### The Decision Ladder for Routing Design

The decision ladder concept can be adapted for agent routing design: map the information states and action states that define the routing problem, and identify the shortcuts that efficient routing takes.

For a well-understood task type, expert routing doesn't go through full deliberate analysis — it recognizes the task type pattern and routes directly. The decision ladder makes explicit what pattern is being recognized and what routing decision it triggers. This enables the encoding of expert routing heuristics in explicit, auditable form.

For novel or ambiguous task types, the full decision ladder must be traversed: gather information about the task structure, diagnose the task type, identify the appropriate approach, plan the decomposition, and execute the routing. The decision ladder specifies what information is needed at each step.

### Constraint Violations as Diagnostic Signals

When an agent system fails or produces poor outputs, constraint mapping provides a diagnostic framework. Ask: which constraint was violated?

- If a functional purpose constraint was violated: the system solved the wrong problem
- If an abstract function constraint was violated: the system produced a logically invalid or domain-inconsistent output
- If a generalized function constraint was violated: the system lacked a necessary capability for this class of problem
- If only a physical function or form constraint was violated: the output structure was wrong but the content may be salvageable

This diagnostic framework enables targeted response: different constraint violations require different fixes, and identifying which constraint was violated is the first step toward fixing the right thing.