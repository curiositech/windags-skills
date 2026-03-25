# Hierarchies, Abstraction Levels, and the Coordination of Specialized Expertise

## The Expertise Localization Problem

Jenkins and Jarvis identify a fundamental challenge in modeling organizations and multi-agent systems: **different parts of the system possess different, specialized knowledge, and that knowledge exists at different levels of abstraction**.

The POM model represents this through Element 7.3, "Professional Knowledge"—the specialized expertise possessed by those responsible for particular decisions. But the paper goes deeper, examining how this specialized knowledge must coordinate with organizational-level processes to produce coherent action.

This maps directly to a critical challenge in AI agent orchestration: **How do you coordinate highly specialized agents (with deep expertise in narrow domains) with general coordinating agents (with shallow expertise in broad domains)?** How do abstraction levels enable versus constrain effective action?

## Three Types of Hierarchy in the Combined POM-BDI Model

The paper implicitly identifies three distinct hierarchical structures:

### 1. Organizational Hierarchy (Who Controls Whom)
This is the traditional org chart: managers, directors, executives forming a control hierarchy. In agent terms: coordinator agents, orchestrator agents, meta-controllers.

### 2. Abstraction Hierarchy (Levels of Detail)
From high-level strategic concerns ("improve system reliability") down to specific technical actions ("increase database connection pool size"). Each level represents a different granularity of concern.

### 3. Expertise Hierarchy (Domain Specialization)
From generalist knowledge (understanding of overall system) to specialist knowledge (deep expertise in specific subsystem). This isn't about seniority—it's about breadth versus depth.

**Critical Insight**: These three hierarchies don't necessarily align. A specialist agent might be:
- Low in organizational hierarchy (takes orders)
- High in abstraction specificity (operates at detailed technical level)
- High in expertise depth (knows more about its domain than any coordinator)

This misalignment creates coordination challenges.

## The Problem: Intentions Don't Cleanly Decompose

Traditional hierarchical decomposition assumes: High-level intention → decompose → lower-level intentions → decompose → concrete actions

But the paper's analysis of POM shows this is oversimplified. Consider Element 7 (IT System Development):

**High-Level Organizational Intention**: "Improve organizational effectiveness through IT"

This doesn't cleanly decompose into technical intentions because:
1. **Expertise gap**: High-level agents don't know enough to do detailed decomposition
2. **Context sensitivity**: What's technically appropriate depends on details only visible at lower levels
3. **Emergent complexity**: Interactions between technical components create behaviors not predictable from high-level view

The paper's solution: **Professional Knowledge (beliefs) + Requirements (desires) → Technical Intentions**

The decomposition isn't pure top-down imposition—it's a synthesis where specialist expertise shapes how general requirements become specific intentions.

## Expertise as Specialized Belief Systems

In BDI terms, expertise is primarily about **beliefs**:
- Beliefs about what's possible
- Beliefs about cause-and-effect relationships
- Beliefs about what approaches work in what contexts
- Beliefs about risks and trade-offs

When Jenkins and Jarvis map Professional Knowledge (Element 7.3) to Beliefs in BDI, they're recognizing that **expertise is specialized knowledge about the domain**.

Example: Database specialist agent's beliefs:
- "Query latency above 100ms indicates problem"
- "Connection pool saturation causes cascading failures"
- "Read replicas reduce load on primary"
- "ACID guarantees require write serialization"

These beliefs are detailed, technical, and domain-specific. A general coordinator agent doesn't and shouldn't have these beliefs—it would be overwhelmed trying to maintain specialist knowledge about all domains.

## The Coordination Pattern: Desire Translation Through Expert Belief Systems

The paper shows (particularly in the revised Element 7 model) a crucial pattern:

1. **High-level desires emerge** from organizational discourse
   - "Improve system performance"
   - "Reduce operational costs"

2. **Desires are passed to specialists** who possess relevant expertise
   - Performance desire → sent to database, caching, and network agents

3. **Specialists interpret desires through their belief systems** (expertise)
   - Database agent: "Improve performance → likely means reduce query latency → could optimize indexes or increase connection pool"

4. **Specialists form specific intentions** based on their interpretation
   - Database agent intention: "Analyze slow query log and optimize worst performers"

5. **Intentions are executed**, producing outcomes

6. **Outcomes inform beliefs** (learning loop)
   - "Optimizing indexes improved performance → strengthen belief that index optimization is effective approach"

This pattern is **bidirectional**: desires flow down, expertise shapes interpretation, actions flow down, and outcomes flow back up to inform future desires.

## Why This Matters: The Expert Bottleneck Problem

In purely hierarchical systems, coordinators become bottlenecks because they must:
1. Understand specialist domains well enough to form detailed plans
2. Verify that specialist work is correct and appropriate
3. Integrate specialist outputs into coherent wholes

But as Jenkins and Jarvis note, this is often infeasible: **specialists possess "Professional Knowledge" that coordinators don't have**.

The alternative: **Coordinators specify what, specialists determine how**.

**Coordinator**: "We need better database performance" (desire)  
**Database Specialist**: "I'll optimize indexes, based on my analysis" (intention formed using expertise)

The coordinator doesn't need to understand index optimization—it needs to:
- Recognize when database performance matters (filter for relevant concerns)
- Communicate the desire clearly
- Evaluate whether specialist's actions achieved the goal (outcome assessment)

## Abstraction Level Coordination: The Interface Problem

Different abstraction levels require different vocabularies. Coordinators speak in business/system terms; specialists speak in technical terms. The paper's model suggests desires and beliefs provide the translation layer:

**Coordinator Desire**: "Improve user experience" (abstract)  
↓ (translation through discourse/context sharing)  
**Frontend Specialist Desire**: "Reduce first-render time" (more specific)  
↓ (specialist interprets through beliefs about frontend performance)  
**Frontend Specialist Intention**: "Implement lazy loading for below-fold content" (concrete action)

Each level:
- Operates at its appropriate abstraction
- Translates to the level below through desire + belief combination
- Reports outcomes back up for learning

## Practical Architecture: Abstraction-Aware Agent Coordination

### Level 0: Orchestrator/Coordinator Agents
**Abstraction Level**: System-wide, strategic  
**Beliefs**: General system architecture, agent capabilities, high-level performance/cost/quality trade-offs  
**Desires**: Emerge from organizational goals or user requests  
**Intentions**: Assign subproblems to appropriate specialist agents  

**Example**: "System reliability is degrading → Assign investigation to monitoring, database, and network agents"

### Level 1: Domain Specialist Agents
**Abstraction Level**: Subsystem-specific, tactical  
**Beliefs**: Deep domain expertise, detailed component knowledge, specific optimization techniques  
**Desires**: Received from coordinator, plus domain-specific goals  
**Intentions**: Specific diagnostic or remediation actions  

**Example**: Database agent forms intention "Analyze query patterns from last 24 hours" based on coordinator's desire for reliability investigation

### Level 2: Execution/Action Agents  
**Abstraction Level**: Concrete operations  
**Beliefs**: Operational knowledge (how to run tools, access systems)  
**Desires**: Carry out specific tasks requested by specialists  
**Intentions**: Execute commands, collect data, modify configurations  

**Example**: Execute "EXPLAIN ANALYZE" on top 10 slowest queries

### Translation Mechanisms

**Downward (Desire Elaboration)**:
- Coordinator: "Improve reliability" (abstract desire)
- Specialist: "Improve reliability → in my domain means → reduce query latency → requires → analyze slow queries" (elaboration using beliefs)

**Upward (Outcome Abstraction)**:
- Execution: "Ran EXPLAIN ANALYZE, found missing index" (concrete outcome)
- Specialist: "Missing index found → adding it will reduce query time → addresses reliability concern" (abstraction using beliefs)
- Coordinator: "Database agent reports reliability issue identified and fix proposed" (high-level summary)

## The Learning Hierarchy: Where Knowledge Accumulates

One of the paper's key insights (in the revised Element 7 diagram) is that **professional knowledge is informed by action outcomes**, creating a learning loop.

But different agents learn different things:

### Coordinators Learn:
- Which specialist agents are effective for which problems
- What level of improvement is achievable in what timeframes
- How different system aspects interact (database performance affects user experience)

### Specialists Learn:
- Which techniques work in which contexts
- What trade-offs exist in their domain
- How their domain interacts with adjacent domains

### Executors Learn:
- How to perform operations more efficiently
- Common failure modes of tools/commands
- Error patterns and workarounds

This distribution of learning is crucial: **Each level learns what's relevant at its abstraction level**. Coordinators don't need to learn that "B-tree indexes are faster than hash indexes for range queries"—that's specialist knowledge. Specialists don't need to learn that "user retention is down 3%"—that's coordinator-level context.

## Failure Modes: When Hierarchies Break Down

### 1. Abstraction Violation (Micromanagement)
**Symptom**: Coordinator forms overly specific intentions, bypassing specialist expertise

**Example**: Coordinator intention: "Add B-tree index on users.email_address column" instead of "Improve user authentication performance"

**Problem**: Coordinator lacks specialist beliefs to make good detailed decisions; bypasses expert judgment

**Prevention**: Coordinators should form desires at their level of expertise, not intentions at specialist level

### 2. Expertise Isolation (Ivory Tower)
**Symptom**: Specialists pursue technically optimal solutions that don't address organizational desires

**Example**: Database agent optimizes for throughput when organization needs latency reduction

**Problem**: Specialists form intentions based only on domain beliefs, ignoring organizational context

**Prevention**: Ensure desires flow downward clearly; specialists should interpret through both domain beliefs AND organizational desires

### 3. Belief Gap (Translation Failure)
**Symptom**: Coordinators and specialists can't communicate effectively; desires get lost in translation

**Example**: Coordinator wants "better UX"; specialist doesn't know how to translate that into technical intentions

**Problem**: No shared vocabulary or conceptual bridge between abstraction levels

**Prevention**: Develop intermediate representations (requirements documents, success criteria) that bridge levels

### 4. Knowledge Hoarding
**Symptom**: Specialists don't share beliefs upward; coordinators remain ignorant of technical realities

**Example**: Database agent knows database is near capacity but doesn't inform coordinator until failure

**Problem**: Coordinators can't form appropriate desires without understanding specialist context

**Prevention**: Specialists should proactively share relevant beliefs upward, not just respond to desires

### 5. Premature Specificity
**Symptom**: High-level desires are formed too specifically, constraining specialist creativity

**Example**: "Reduce costs by switching to smaller database instances" vs. "Reduce database costs"

**Problem**: Precludes specialists from finding better solutions (maybe caching reduces load, allowing smaller instances as side effect)

**Prevention**: Keep desires abstract at high levels; let specialists propose specific approaches

### 6. Lost Context in Aggregation
**Symptom**: Outcomes flowing upward lose crucial context; coordinators can't learn effectively

**Example**: Specialist reports "Fixed performance issue" but coordinator doesn't learn what was wrong or how it was fixed

**Problem**: Coordinators can't improve future desire formation without understanding specialist actions/outcomes

**Prevention**: Upward reporting should include sufficient context for learning without overwhelming with detail

## Design Principles for Hierarchy-Aware Orchestration

### 1. Match Agent Abstraction Level to Task Abstraction Level
Don't send detailed technical tasks to coordinators or abstract strategic tasks to execution agents. Route tasks to agents operating at the appropriate abstraction level.

### 2. Desires Flow Down, Expertise Flows Up
Coordinators specify **what's wanted** (desires). Specialists specify **how to achieve it** (intentions based on expertise). This respects the knowledge distribution.

### 3. Outcomes Flow Up With Appropriate Abstraction
Lower levels report outcomes to higher levels, but abstract appropriately:
- To specialists: "Query optimization reduced latency by 40ms"
- To coordinators: "Database performance improved significantly"

### 4. Make Beliefs Explicit at Each Level
Agents should be able to articulate their beliefs at their level of abstraction:
- Coordinator belief: "Database performance affects user experience"
- Specialist belief: "Missing indexes cause slow queries"

This enables checking whether beliefs are appropriate for the level.

### 5. Support Belief Sharing Across Levels
Specialists should be able to share relevant beliefs upward:
- "Database is at 80% capacity → we'll hit limits soon"
- This informs coordinator's future desires

Coordinators should be able to share relevant beliefs downward:
- "User retention is dropping → performance may be factor"
- This informs specialist's interpretation of performance desires

### 6. Create Accommodation Zones at Level Boundaries
Conflicts often occur at boundaries between abstraction levels. Create explicit mechanisms for accommodations:
- Specialist wants to do comprehensive refactoring (slow, high-quality)
- Coordinator wants quick fix (fast, lower-quality)
- Accommodation: "Quick fix now, refactoring scheduled for next quarter"

### 7. Design for Bidirectional Learning
- Coordinators learn from outcomes which specialists/approaches work
- Specialists learn from outcomes which techniques are effective
- Both levels improve over time

### 8. Avoid False Hierarchy (Respect Expertise)
Organizational hierarchy shouldn't override expertise hierarchy in technical domains. A coordinator can set priorities (desires) but shouldn't override specialist's technical judgment about implementation (intentions).

## Multi-Level BDI: A Practical Framework

Extending BDI to hierarchical systems:

### Coordinator BDI
```
Beliefs:
  - System-level: "User experience depends on performance, availability, features"
  - Agent capabilities: "Database agent can optimize queries, caching agent can reduce load"
  - Interaction effects: "Database changes may affect caching effectiveness"

Desires (from organizational discourse):
  - "Improve user experience"
  - "Reduce operational costs"
  - "Maintain security compliance"

Intentions (formed from desires + beliefs):
  - "Task database agent with performance investigation"
  - "Task security agent with compliance audit"
  
Actions:
  - Send desires to specialist agents
  - Evaluate specialist outcomes
  - Coordinate across specialists if dependencies exist
```

### Specialist BDI
```
Beliefs:
  - Domain expertise: "Slow queries often caused by missing indexes or inefficient JOINs"
  - Current state: "Database latency increased 40% over 2 weeks"
  - Capabilities: "Can analyze query logs, add indexes, optimize queries"
  - Constraints: "Index additions require table locks, causing brief downtime"

Desires (from coordinator + domain-specific):
  - Received from coordinator: "Improve database performance"
  - Domain-specific: "Maintain query predictability"

Intentions (formed from desires + expert beliefs):
  - "Analyze top 10 slowest queries"
  - "Identify missing indexes"
  - "Propose index additions with downtime estimates"
  
Actions:
  - Run analysis tools
  - Generate recommendations
  - Implement approved changes
  - Report outcomes to coordinator
```

### Belief Flow
Coordinator beliefs are general; specialist beliefs are detailed. But specialists should share **abstracted versions** of their beliefs upward when relevant:

Specialist belief: "Query on users table with WHERE email_address='...' doing full table scan due to missing index"

Abstracted for coordinator: "Database has indexing gaps causing performance issues; fixes identified"

This gives coordinator enough to understand without drowning in technical detail.

## The Deeper Lesson: Hierarchy Enables Expertise

The most profound implication is that **hierarchies of abstraction aren't just organizational structure—they're cognitive necessity for complex systems**.

No single agent can possess:
- Deep expertise across all domains (too much to learn)
- Detailed knowledge of all current state (too much to perceive)
- Specific understanding of all interactions (too complex to model)

Hierarchies solve this through **cognitive distribution**:
- High-level agents maintain broad, shallow knowledge
- Low-level agents maintain narrow, deep knowledge
- Translation mechanisms (desires ↓, outcomes ↑) enable coordination

For AI orchestration systems, this means:

**Don't Build**: Monolithic super-agents that try to know everything

**Do Build**: Hierarchies of specialized agents with clear abstraction levels and translation mechanisms

**Don't Build**: Systems where coordinators must understand all specialist domains

**Do Build**: Systems where coordinators set goals, specialists determine methods, based on respective expertise

**Don't Build**: Pure top-down control where all intentions come from the top

**Do Build**: Desire elaboration where high-level desires are refined into specific intentions by specialists using their expertise

**Don't Build**: Opaque specialists that don't explain their actions

**Do Build**: Specialists that report outcomes with appropriate abstraction for coordinator learning

The gap between knowing and doing in hierarchical systems is bridged by **appropriate distribution of knowledge across abstraction levels**, with clear mechanisms for desires to flow down (enabling coordination) and outcomes to flow up (enabling learning), while respecting that different levels possess different, equally important, kinds of knowledge.