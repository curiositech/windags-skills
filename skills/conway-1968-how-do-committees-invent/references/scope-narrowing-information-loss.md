# Scope Narrowing as Information Loss: What Agents Cannot See When Their Inquiry Is Bounded

## The Core Mechanism

Conway identifies a subtle but critical form of information loss in complex systems: "Every time a delegation is made and somebody's scope of inquiry is narrowed, **the class of design alternatives which can be effectively pursued is also narrowed**."

This isn't about losing information in the sense of data - the agent still has all necessary data for their assigned subproblem. It's about losing **the ability to see certain solution patterns**. When an agent's scope is narrowed to a subproblem, they cannot see optimizations that transcend subproblem boundaries.

The mechanism:
1. Complex problem is decomposed into subproblems
2. Each agent is assigned responsibility for one subproblem
3. Agent optimizes within their assigned scope
4. Cross-cutting optimizations requiring changes to the decomposition itself become invisible
5. System achieves local optima but misses global optima

Conway doesn't use the term "information loss," but his analysis reveals it: **the system collectively has enough intelligence to see the better solution, but the decomposition prevents that intelligence from being applied**.

For agent orchestration systems, this means: task decomposition isn't just about work allocation - it's about controlling what optimizations are visible to the system.

## What Gets Lost

### 1. Cross-Cutting Architectural Patterns

When agents are assigned scopes, they optimize within those scopes. Architectural patterns that span multiple scopes become invisible.

**Example from Conway's analysis**: Computer systems with separate hardware engineers, system programmers, and application programmers. Each group optimizes within their domain:
- Hardware: speed, efficiency, instruction set richness
- System software: abstraction, services, resource management
- Application: functionality, user experience

But the cross-cutting optimization "design hardware and system software together to provide efficient primitives for common application patterns" requires seeing across all three scopes. Conway notes: "Those rare instances where the system hardware and software tend to cooperate rather than merely tolerate each other are associated with manufacturers whose programmers and engineers bear a similar relationship."

The pattern exists, but scope boundaries make it invisible to separated teams.

For agent systems: If you assign separate agents to (1) algorithm choice, (2) data structure design, and (3) performance optimization, none can see "choose algorithm and data structures together based on performance characteristics." That optimization requires seeing across all three scopes.

### 2. Problem Reformulation Opportunities

Conway emphasizes that "the design which occurs first is almost never the best possible." Often, the best solution involves reformulating the problem itself, not just solving the stated problem optimally.

But problem reformulation requires stepping back from assigned subproblems to see the whole. Agents with narrowed scope cannot do this - they're committed to solving their assigned piece.

**Example**: Decompose "build high-performance web service" into:
- Agent A: Optimize database queries
- Agent B: Add caching layer
- Agent C: Parallelize request handling

Each optimizes within scope. But none can see: "Reformulate to event-driven architecture that eliminates need for expensive queries." That requires seeing across all scopes and questioning the decomposition itself.

For agent systems: The most valuable solutions often involve discovering that the problem as stated shouldn't be solved that way at all. Scope narrowing makes these insights impossible - by definition, agents cannot question the scope they're assigned.

### 3. Interface Simplification

Conway notes that interfaces between subsystems must be negotiated between design groups. But interface complexity often results from suboptimal decomposition choices.

When scopes are narrowed, agents optimize for their subsystem, leading to complex interfaces. But simpler interfaces might exist if the decomposition itself changed.

**Example**: Frontend agent and backend agent negotiate REST API as interface. Each optimizes:
- Frontend: requests all data it might need
- Backend: provides flexible query capabilities

Result: complex API with many endpoints. But if scopes weren't fixed, might discover: "Use GraphQL to let frontend query exactly what it needs" or even "Merge frontend/backend boundary for this use case."

For agent systems: Interface complexity is often symptom of poor decomposition. But agents with narrowed scopes cannot see this - they can only negotiate more complex interfaces.

### 4. Duplication Detection

Conway's homomorphism implies that if agents A and C cannot communicate (no branch between them), their subsystems won't communicate either. This creates risk of duplication.

If both A and C need similar functionality but cannot coordinate (outside their scopes or no communication path), they'll implement separately.

**Example**: Agent A (user authentication) and Agent C (API authorization) both need token validation. If they cannot coordinate (different scopes, no communication path), they'll implement separate token validators with subtly different logic, creating inconsistency bugs.

For agent systems: Scope narrowing prevents agents from seeing that other agents are solving similar problems. Even if both solutions are locally optimal, duplication wastes resources and creates maintenance burden.

### 5. Dependency Inversion Opportunities

Sometimes optimal solutions require inverting dependencies - having component X depend on component Y instead of Y depending on X. But agents with fixed scopes often cannot see or propose such inversions.

**Example**: Standard decomposition has UI depend on business logic depend on data access. Agent assigned to UI optimizes within that constraint. But optimal solution might invert: business logic depends on interfaces, UI and data access both implement those interfaces (dependency inversion principle).

Seeing this requires understanding all three layers and their relationships - scope narrowing to one layer prevents this insight.

For agent systems: Architectural patterns like dependency inversion, event-driven design, or pub-sub require seeing across component boundaries. Agents with narrowed scopes cannot propose such patterns even when they'd be superior.

## Why This Information Loss Is Insidious

Conway's analysis reveals why this is particularly dangerous:

### 1. Locally Optimal, Globally Suboptimal

Each agent successfully solves their assigned subproblem optimally. Integration succeeds - all pieces work together. But the overall solution is suboptimal compared to solutions requiring different decomposition.

There's no obvious failure signal. Each agent reports success, integration works, customer accepts delivery. Only deep analysis reveals the system is fundamentally suboptimal.

### 2. Cannot Be Detected from Within

Agents within narrowed scopes cannot see they're missing better solutions. They can optimize within scope until no improvements remain and never realize cross-scope optimizations exist.

Conway: "Given any design team organization, there is a class of design alternatives which cannot be effectively pursued by such an organization because the necessary communication paths do not exist."

For agent systems: If your orchestration architecture narrows scopes, agents cannot detect they're missing solutions. They need external perspective (human oversight, meta-reasoning agent, or architectural review).

### 3. Reinforces Itself Over Time

Once a decomposition is established and agents optimize within their scopes, the system becomes increasingly locked in:
- Agents build expertise in their narrow domains
- Interfaces become complex and rigid
- Changing decomposition requires discarding accumulated work
- Organizational incentives favor continuing current path

Conway notes reorganization is "painful and expensive." The longer the system runs with narrowed scopes, the harder it becomes to escape.

### 4. Appears as Integration Problems

When scope narrowing causes information loss, symptoms appear as "integration is harder than expected" or "components don't fit together well." This is often blamed on poor implementation or insufficient coordination.

But Conway's analysis reveals the root cause: the decomposition itself was suboptimal, and scope narrowing prevented agents from seeing this. More coordination or better implementation won't help - the decomposition needs to change.

## Detection Strategies

How can agent systems detect information loss from scope narrowing?

### 1. Cross-Scope Analysis

Periodically, have capable agents analyze across scope boundaries to identify cross-cutting optimization opportunities that in-scope agents cannot see.

**Implementation**: After initial solutions from scoped agents, meta-reasoning agent reviews:
- Are there patterns duplicated across scopes?
- Do interfaces seem more complex than necessary?
- Are there architectural refactorings that would simplify multiple scopes?
- Would different decomposition enable better solutions?

### 2. Interface Complexity Metrics

Complex interfaces often signal suboptimal decomposition. Track:
- Number of interface points between components
- Complexity of interface specifications
- Frequency of interface renegotiation
- Amount of context needed to understand interfaces

High values suggest scope boundaries are fighting problem structure.

### 3. Optimization Opportunity Tracking

Ask agents: "What optimizations can you see that would improve your solution but require changes outside your scope?"

If agents frequently identify such opportunities, scope narrowing is causing information loss.

### 4. Alternative Decomposition Exploration

Don't commit to single decomposition. Have agents propose alternative decompositions:
- What if we merged scopes A and B?
- What if we split scope C differently?
- What if we eliminated this interface entirely?

Compare solutions under different decompositions to detect when scope narrowing is costly.

### 5. Benchmarking Against Integrated Solutions

For some problems, have both scoped agents (narrow inquiry) and integrated agents (broad inquiry) solve it. Compare:
- Solution quality
- Development time
- Coordination overhead
- Maintainability

If integrated agents consistently produce better solutions, scope narrowing is losing information that matters.

## Mitigation Strategies

Conway's analysis suggests several approaches to reduce information loss from scope narrowing:

### Strategy 1: Delay Decomposition

"Either he struggles to reduce the system to comprehensibility and wins, or else he loses control of it."

Keep problems in broader scopes longer. Only narrow scopes when:
- Problem structure is well understood
- Natural boundaries are clear
- Interfaces will be stable
- Benefits of parallelization exceed costs of information loss

For agent systems: Don't immediately decompose complex problems. Have capable agents work at high level until understanding is sufficient for confident decomposition.

### Strategy 2: Overlapping Scopes

Instead of non-overlapping scopes (agent A responsible for X, agent B responsible for Y), use overlapping scopes where agents share some context.

**Implementation**:
- Agents are assigned primary responsibilities but can observe adjacent areas
- Interfaces are co-designed by both agents who use them
- Agents can propose scope adjustments when they see cross-cutting concerns

**Benefit**: Reduces information loss by ensuring agents can see across artificial boundaries.

**Cost**: More coordination overhead, less clear responsibility.

### Strategy 3: Architectural Review Layer

Add meta-level agents whose scope is architectural quality across the system:
- Review decompositions for information loss signals
- Identify cross-cutting optimization opportunities
- Propose scope adjustments or reorganization
- Ensure global objectives aren't sacrificed for local optimization

For agent systems: Don't assume initial decomposition is optimal. Build review capability to detect when scope narrowing causes information loss.

### Strategy 4: Scope-Escape Mechanisms

Allow agents to signal "optimal solution to my problem requires changes outside my scope" and trigger reassessment.

**Implementation**:
- Agents can escalate when they detect cross-scope optimization opportunities
- Escalation triggers review of whether decomposition should change
- Make this culturally acceptable (not failure to stay in scope, but valuable insight)

For agent systems: Treat scope boundaries as provisional, not rigid. Value agents identifying better decompositions over agents staying narrowly focused.

### Strategy 5: Consolidation Over Restriction

Conway's observation that "two men, if they are well chosen... will give us a better system" suggests: when scope narrowing causes information loss, consolidate scopes rather than accepting the loss.

**Implementation**:
- Monitor for signs of information loss (complex interfaces, duplication, optimization opportunities agents cannot pursue)
- When detected, consider merging scopes rather than living with the loss
- Prefer fewer agents with broader scopes over many agents with narrow scopes when information loss is significant

For agent systems: If frontend and backend agents keep discovering cross-scope optimizations they cannot pursue, create single full-stack agent with broader scope.

## The Deeper Principle: Optimization Visibility

Conway's insight about scope narrowing reveals something fundamental about complex problem-solving: **the set of visible optimizations is determined by scope boundaries, not by agent capability**.

A highly capable agent with narrow scope will produce locally optimal solutions that are globally suboptimal. A less capable agent with broad scope might produce globally better solutions by seeing cross-cutting opportunities.

This suggests problem-solving capability isn't just about individual agent intelligence