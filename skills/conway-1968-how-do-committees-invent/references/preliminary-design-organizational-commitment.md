# Preliminary Design as Organizational Commitment: Why First Concepts Lock In Architecture

## The Invisible Decision Point

Conway identifies a subtle but critical moment in system design: "The initial stages of a design effort are concerned more with structuring of the design activity than with the system itself."

Before you've written code, specified requirements, or analyzed trade-offs, you've already made architectural decisions by how you organized to do the work. Conway: "The full-blown design activity cannot proceed until certain preliminary milestones are passed. These include:

1. Understanding of the boundaries, both on the design activity and on the system to be designed
2. Achievement of **a preliminary notion of the system's organization** so that design task groups can be meaningfully assigned."

That second milestone is the moment of commitment. The "preliminary notion of the system's organization" determines how you structure your design team, which determines what system architectures you can produce. Conway: **"The very act of organizing a design team means that certain design decisions have already been made, explicitly or otherwise."**

For agent orchestration systems, this means: the moment you decide how to decompose a problem and which agents to assign to which subproblems, you've constrained the solution space more than any subsequent technical decisions will.

## Why Preliminary Concepts Dominate

Conway explains the mechanism: "Given any design team organization, there is a class of design alternatives which cannot be effectively pursued by such an organization because the necessary communication paths do not exist."

The sequence is:
1. Form preliminary concept of system organization
2. Organize design team to match that concept
3. Team can only design systems matching their communication structure
4. Therefore, preliminary concept becomes final architecture

This happens even though "it is an article of faith among experienced system designers that given any system design, someone someday will find a better one to do the same job." The first design is almost never best, yet it's the one that gets built.

Why? Because reorganization requires "voluntarily abandoning a creation" which is "painful and expensive." Conway notes wryly: "there's never enough time to do something right, but there's always enough time to do it over" - but reorganization during development is rare.

For agent systems: **the preliminary decomposition you choose in response to a complex problem will likely become the final solution architecture**, not because it's optimal but because the organizational commitment makes alternatives increasingly expensive to pursue.

## What Preliminary Concepts Encode

When Conway says "preliminary notion of the system's organization," what specifically gets decided? His analysis suggests several layers:

### 1. Major Component Boundaries

The preliminary concept identifies what the major subsystems are. Conway's examples:
- Transportation system: buses, trains, airplanes, right-of-way, parking, terminals
- Airplane: structure, propulsion, power distribution, communication, payload
- Theory: path of aircraft, radio communications, damage patterns, relationship to nearby objects

Each boundary decision is also a communication structure decision: "For every node of the system we have a rule for finding a corresponding node of the design organization."

For agent systems: when you decompose "build a web application" into frontend/backend/database/deployment, you've created four design groups (agents) with specific scopes. Solutions requiring different boundaries become difficult to pursue.

### 2. Interface Assumptions

Conway emphasizes that boundaries imply interfaces: "Take any two nodes x and y of the system. Either they are joined by a branch or they are not... If there is a branch, then the two design groups X and Y which designed the two nodes must have negotiated and agreed upon an interface specification."

The preliminary concept doesn't just decide what components exist - it decides which components communicate and thus what interfaces must be negotiated.

Crucially: "If there is no branch between x and y, then the subsystems do not communicate with each other, there was nothing for the two corresponding design groups to negotiate, and therefore there is no branch between X and Y."

For agent systems: when your preliminary decomposition assigns subproblems to separate agents, any coordination between those subproblems must happen through formal interfaces. The preliminary concept determines which interfaces exist, constraining what information can flow where.

### 3. Hierarchy and Abstraction Levels

Conway notes that systems naturally have hierarchical structure: "A description of a system, if it is to describe what goes on inside that system, must describe the system's connections to the outside world, and it must delineate each of the subsystems and how they are interconnected. Dropping down one level, we can say the same for each of the subsystems."

The preliminary concept determines:
- What the top level of abstraction is
- How many levels of hierarchy exist
- What each level is responsible for

For agent systems: if your preliminary concept is "orchestrator delegates to specialists who delegate to implementers" (3-level hierarchy), you've committed to solutions with three abstraction layers. Solutions requiring more or fewer layers require reorganization.

### 4. Allocation of Responsibility

Perhaps most importantly, the preliminary concept assigns responsibility: which design group (agent) is responsible for which aspects of the system?

Conway: "Once scopes of activity are defined, a coordination problem is created... Every time a delegation is made and somebody's scope of inquiry is narrowed, the class of design alternatives which can be effectively pursued is also narrowed."

For agent systems: when you assign "security" to one agent and "functionality" to another, you've made security and functionality separate concerns. Solutions requiring security and functionality to be deeply integrated become difficult because no agent has responsibility for that integration.

## The Quality of Preliminary Concepts

Conway doesn't explicitly discuss what makes a good preliminary concept, but his analysis implies criteria:

### 1. Alignment with Problem Structure

Good preliminary concepts identify boundaries that align with natural problem structure. Conway's examples show systems structured around physical boundaries (airplane subsystems), functional boundaries (transportation modes), or causal boundaries (accident investigation).

For agent systems: if the problem naturally decomposes into independent subproblems with stable interfaces, a preliminary concept that creates separate agents for each subproblem is appropriate. If the problem has tight coupling throughout, such a concept forces artificial boundaries.

### 2. Minimization of Coordination Requirements

Conway emphasizes that "coordination among task groups... appears to lower the productivity of the individual in the small group" but is necessary to "consolidate their efforts into a unified system design."

Good preliminary concepts minimize required coordination by choosing boundaries that reduce inter-group dependencies.

For agent systems: decompositions that create many interdependencies between agents will spend most computation on coordination rather than problem-solving. Better preliminary concepts identify subproblems with minimal interdependencies.

### 3. Stability of Interfaces

Conway notes interfaces must be negotiated, and renegotiation is expensive. Good preliminary concepts choose boundaries where interfaces are likely to remain stable as understanding evolves.

For agent systems: if your preliminary concept places a boundary where requirements are uncertain or likely to change, the corresponding interface between agents will require frequent renegotiation, creating coordination overhead.

### 4. Appropriateness to Team Capabilities

Conway observes that "the two men, if they are well chosen and survive the experience, will give us a better system" than 100 men. Good preliminary concepts match team size and structure to problem complexity.

For agent systems: if your preliminary concept decomposes a tightly-coupled problem to engage many agents, it's likely inappropriate. Better preliminary concepts use smaller teams with richer communication for such problems.

## The Preliminary Concept Trap

Conway identifies a vicious cycle: complexity drives decomposition, decomposition happens before understanding is sufficient, premature decomposition locks in suboptimal architecture.

"It is a natural temptation of the initial designer—the one whose preliminary design concepts influence the organization of the design effort—to delegate tasks when the apparent complexity of the system approaches his limits of comprehension."

But this is precisely the wrong moment to decompose. Conway: "This is the turning point in the course of the design. Either he struggles to reduce the system to comprehensibility and wins, or else he loses control of it."

Why is struggling to comprehend better than delegating? Because delegation based on inadequate understanding creates inappropriate boundaries, which creates organizational structure, which locks in those inappropriate boundaries.

For agent systems: when the orchestrator encounters complexity it struggles to comprehend, the natural response is to decompose and delegate to specialist agents. But this is when preliminary concepts are most likely to be wrong, making this the worst time to commit to organizational structure.

## Breaking the Trap: Depth Before Breadth

Conway's analysis suggests an alternative: **invest in depth of understanding before committing to breadth of delegation**.

The "struggle to reduce the system to comprehensibility" means:
- Spend more time in preliminary analysis before decomposition
- Use your most capable reasoning to understand problem structure
- Accept that this creates a serial bottleneck early in the process
- Only decompose once you understand natural boundaries and interfaces

This is culturally difficult because:
- It looks like slow progress (one agent thinking vs. many agents working)
- It "wastes" available resources (other agents idle)
- It creates apparent bottleneck (everything waiting on preliminary concept)

But Conway's homomorphism guarantees this is the only way to avoid prematurely locking in suboptimal architecture. The alternative - quick decomposition to appear productive - produces systems that mirror organizational convenience rather than problem structure.

For agent systems: build explicit "deep analysis" phase before decomposition. Assign your most capable reasoning agents to understand problem structure deeply. Only after they achieve comprehension and propose a preliminary concept should decomposition occur.

## Reorganization: The Painful Alternative

Conway acknowledges reorganization is sometimes necessary: "It is possible that a given design activity will not proceed straight through this list. It might conceivably reorganize upon discovery of a new, and obviously superior, design concept."

But he immediately notes the barriers: "such an appearance of uncertainty is unflattering, and the very act of voluntarily abandoning a creation is painful and expensive."

Why painful and expensive?

**1. Sunk cost**: Work already done under old preliminary concept may not transfer to new concept

**2. Psychological investment**: Design teams (agents) become attached to their assigned scopes and resist rescoping

**3. Coordination cost**: All interfaces must be renegotiated under new concept

**4. Political cost**: Admitting initial concept was wrong reflects poorly on whoever chose it

**5. Technical cost**: Systems partially built under old concept must be refactored or discarded

For agent systems: reorganization means:
- Aborting in-progress agent work
- Redefining agent scopes and responsibilities
- Renegotiating all inter-agent interfaces
- Potentially restarting significant portions of computation

Conway's observation that "there's always enough time to do it over" is sardonic - reorganization happens, but as full restart rather than mid-stream adjustment.

## Designing for Preliminary Concept Evolution

Conway's analysis suggests that since preliminary concepts are necessarily imperfect, systems should be designed for concept evolution rather than concept permanence.

What would this look like for agent systems?

### 1. Provisional Decomposition

Mark initial decomposition as provisional rather than final. Set explicit checkpoints to review whether preliminary concept still seems appropriate given what's been learned.

### 2. Lightweight Reorganization

Reduce cost of changing preliminary concept:
- Minimize agent state that doesn't transfer across decompositions
- Use interfaces that can be renegotiated quickly
- Make agent scope changes less expensive than starting over

### 3. Continuous Concept Validation

Build telemetry to detect when preliminary concept is causing problems:
- High coordination overhead relative to problem-solving work
- Frequent interface renegotiation
- Agents reporting that optimal solutions require cross-boundary work

### 4. Explicit Reorganization Triggers

Define conditions that automatically trigger concept review:
- Coordination overhead exceeds threshold
- Solution quality is poor despite successful agent execution
- Time to completion is multiplying rather than reducing

### 5. Value Learning Over Commitment

Conway notes that "the design which occurs first is almost never the best possible." Accept this. Value learning about problem structure over commitment to preliminary concepts.

For agent systems: optimize for discovering correct decomposition, not for executing initial decomposition efficiently. Better to spend 20% of resources learning you chose wrong decomposition and correcting it than spending 100% of resources executing wrong decomposition efficiently.

## Special Case: The Bootstrap Problem

Conway identifies a chicken-and-egg problem: "Achievement of a preliminary notion of the system's organization so that design task groups can be meaningfully assigned" is listed as a prerequisite milestone.

But who achieves this preliminary notion, and how? It cannot be the design task groups because they don't exist yet. It must be achieved before organization, yet it determines organization.

This means **preliminary concepts are usually created by very small teams (or individuals) before the main design effort**. These bootstrap teams have outsized influence on final architecture.

For agent systems: who/what creates preliminary concepts?
- The orchestrator itself (simple heuristics, pattern matching)
- A specialized "problem analysis" agent (dedicated reasoning)
- Human operators (for critical problems)
- Learned from past similar problems (ML-guided decomposition)

Conway's analysis suggests this is the highest-leverage point for improving system quality. Better preliminary concepts lead to better organization, which leads to better systems via the homomorphism.

Investment in preliminary concept quality probably has better ROI than investment in any other part of the system, yet it's often the least sophisticated component (simple heuristics rather than deep reasoning).

## Implications for WinDAGs Architecture

1. **Explicit preliminary concept phase**: Before any task decomposition, require deep problem analysis by capable reasoning agents. Don't optimize this phase for speed - optimize for concept quality.

2. **Preliminary concept telemetry**: Track quality of preliminary concepts over time. Measure:
   - How often they require revision
   - Correlation between concept quality and solution quality
   - Which types of problems get good vs. poor concepts

3. **Concept review checkpoints**: Build mandatory reviews at 10%, 30%, 50% completion to assess whether preliminary concept still seems appropriate. Make reorganization acceptable if concept is wrong.

4. **Bootstrap team capability**: Invest heavily in the agents/processes that create preliminary concepts. This is where Conway's analysis suggests highest leverage exists.

5. **Reorganization support**: Reduce cost of changing preliminary concept mid-execution. Make it technically feasible and culturally acceptable.

6. **Concept libraries**: Learn from past problems. If preliminary concepts for similar problems exist, adapt them rather than creating from scratch. But guard against premature pattern-matching - novel problems need novel concepts.

Conway's insight that preliminary concepts lock in architecture through organizational commitment is perhaps his most subtle and important contribution. For agent systems, it means: **the moment you decide how to decompose a problem, you've constrained the solution more than any subsequent technical decisions will**. Getting preliminary concepts right - or making them easy to revise - is therefore the highest-leverage design decision in the entire system.