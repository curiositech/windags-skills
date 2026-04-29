# From Discourse to Action: How Organizational Desires Emerge Through Social Interaction

## The Standard BDI Assumption: Desires as Primitives

In most BDI (Belief-Desire-Intention) agent architectures, desires are treated as given—they're primitives that an agent simply has. An agent might be programmed with desires like "maximize efficiency" or "maintain security" or "respond within 200ms." These desires are input parameters, not emergent properties.

This makes sense for individual software agents operating in well-defined domains. But Jenkins and Jarvis identify a critical limitation: **"In standard BDI, desires are often treated as primitives. But in organizational POM, desires emerge through the social process of discourse—they're not simply aggregations of individual desires but new entities created through conversation, negotiation, and power dynamics."**

This isn't just a philosophical distinction—it has profound implications for how multi-agent systems should be designed and how they can model organizational behavior.

## The POM View: Desires Emerge From Discourse

In Checkland and Holwell's POM model, discourse (Element 3) is where individuals and groups interact. This discourse leads to "Created Meanings" (Element 4), which then somehow produce "Related Intentions and Accommodations" (Element 5), which drive "Purposeful Action" (Element 6).

But Jenkins and Jarvis notice something missing: **"Missing from this equation are desires, which... are a core component of the BDI architecture."**

Their solution is elegant: desires don't come from individuals in isolation—they emerge FROM the discourse itself. As they explain: "It suggests that desires emerge through the process of discourse. As individuals and groups enter into discourse, their own, individual, sets of desires merge together. What is produced is Element 9 - a collection of related and unrelated desires, which can be combined with the beliefs contained in Element 4, to bring about a set of related intentions and accommodations."

## What "Emergence" Actually Means Here

When the paper says desires "emerge," it doesn't mean they're magically created from nothing. It means they arise through a social process that:

1. **Transforms individual desires through interaction**: Person A wants "fast deployment," Person B wants "zero downtime," discourse produces organizational desire for "blue-green deployment strategy"—which neither individually wanted before the conversation

2. **Creates desires through negotiation**: Neither party wanted "deploy on weekends only" but through negotiation about competing concerns, this emerges as acceptable accommodation

3. **Generates desires through power dynamics**: The CTO's preference becomes an organizational desire not through consensus but through authority

4. **Produces desires through collective sensemaking**: The group discussing production failures might collectively generate a desire for "comprehensive observability" that emerges from their shared analysis, not from any individual's pre-existing preference

This is fundamentally different from desire aggregation (voting, averaging, preference combination). It's **desire generation**—new goals that didn't exist before discourse began.

## Why This Matters for Multi-Agent Systems

### Problem 1: Coordination Without Pre-Programmed Goals

In traditional multi-agent systems, coordination happens between agents with fixed, pre-programmed goals. Agent A wants X, Agent B wants Y, they negotiate based on utilities. But real systems often need to **discover what their goals should be** through interaction.

Consider a WinDAGs-style orchestration system tasked with "improve system reliability." The individual agents (monitoring, debugging, testing, deployment) don't have pre-existing desires about HOW to improve reliability. Instead:

1. **Monitoring agent shares observations**: "High error rates in authentication service"
2. **Debugging agent shares hypothesis**: "Likely race condition under load"
3. **Testing agent shares constraint**: "Current tests don't cover concurrent access"
4. **Discourse emerges**: Through their interaction, a desire crystallizes: "comprehensive concurrency testing of authentication"

This desire didn't exist in any agent beforehand—it emerged from their collective discourse. And it's more specific, more actionable, and more appropriate than any pre-programmed goal would have been.

### Problem 2: Adapting Goals to Discovered Context

Pre-programmed desires work in predictable environments. But when an agent system encounters novel situations, it needs to **form new desires based on what it learns**.

The paper's model shows this: "Created Meanings" (Element 4, which maps to Beliefs in BDI) combine with emergent desires (Element 9) to produce intentions. As agents learn new things about their environment, they can participate in discourse that generates new desires appropriate to that context.

Example: An agent system monitoring application performance discovers an unusual pattern—requests slow down periodically in ways that don't correlate with load. Through discourse:
- **Belief formed**: "Something external is affecting performance cyclically"
- **Discourse explores**: Agents exchange theories (database backups? cache expiration? external API rate limits?)
- **Desire emerges**: "Correlate performance with scheduled maintenance across all dependencies"

This desire couldn't have been pre-programmed because the situation was novel. It emerged from agents collectively making sense of unexpected observations.

### Problem 3: Managing Conflicting Desires Without Imposed Hierarchy

Jenkins and Jarvis emphasize that Checkland doesn't expect discourse to produce consensus: **"It is not assumed that discourse will produce consensus, as will be seen in Element 6. Instead it is expected that the discourse may result in contradictory aims."**

This is realistic but creates a design challenge: how do systems handle contradictory desires? The POM answer: **"accommodations may emerge which will permit continuing progress, in spite of the lack of true consensus."**

Accommodations aren't compromises or averaged preferences—they're creative solutions that let contradictory desires coexist. For agent systems, this means:

- **Don't force resolution**: Two agents can maintain contradictory desires if accommodations exist
- **Design for coexistence**: Create mechanisms where agents can pursue incompatible goals in ways that don't obstruct each other
- **Make accommodations explicit**: If Agent A desires "minimize API calls" and Agent B desires "maximize data freshness," an accommodation might be "Agent B gets priority during business hours, Agent A controls evening behavior"

## The Discourse Process: What Actually Happens

The paper notes that discourse isn't clean: **"discourse doesn't just involve rational discourse, but also political battles, coercion, and persuasion."**

For AI systems, this suggests that desire formation involves:

### 1. Information Exchange
Agents share observations, beliefs, hypotheses. This creates shared context—a common basis for collective goals.

**Implementation**: Agents should have mechanisms to broadcast relevant beliefs and observations to peers before forming intentions.

### 2. Constraint Surfacing  
Agents reveal their limitations, dependencies, and boundaries. This prevents formation of desires that are impossible given actual constraints.

**Implementation**: Agents should be able to declare "I cannot X because Y" and have that constraint shape collective discourse.

### 3. Value Articulation
Agents express what they prioritize and why. This isn't just stating preferences—it's explaining the reasoning behind them.

**Implementation**: When an agent proposes a desire, it should provide justification linked to higher-level values or goals.

### 4. Creative Exploration
Agents propose novel combinations, alternatives, reframings. This is where desires emerge that no individual agent initially held.

**Implementation**: Agents should be able to synthesize proposals that combine elements from multiple agents' contributions.

### 5. Power and Authority
Some agents may have override authority, or certain types of desires may require specific approvals. This isn't necessarily bad—it's realistic organizational behavior.

**Implementation**: Agents should have explicit authority levels, and desire formation should respect these hierarchies where appropriate.

### 6. Accommodation Finding
When consensus can't be reached, agents seek ways to coexist. This requires creativity and flexibility.

**Implementation**: Agents should be able to propose conditional or bounded versions of desires: "I want X, but only under conditions Y" or "I want X, but will defer to your Z in situations where they conflict."

## Practical Architecture: Desire Formation as Explicit Phase

Based on the discourse-to-desire model, a multi-agent orchestration system might implement desire formation as an explicit phase:

### Phase 1: Observation and Belief Formation
Individual agents perceive their environment, form beliefs about state and relationships, update their internal models.

**Output**: Set of agent beliefs (which may conflict across agents)

### Phase 2: Discourse Initiation
Agents recognize a need for coordination (triggered by task delegation, contradiction detection, or scheduled synchronization).

**Output**: Discourse session opened with participating agents identified

### Phase 3: Context Sharing
Agents exchange relevant beliefs, constraints, capabilities, and priorities. This creates common ground.

**Output**: Shared context representation accessible to all participating agents

### Phase 4: Desire Proposal
Agents propose desires based on their understanding of the situation. These proposals should be tentative, not commitments.

**Output**: Collection of proposed desires (likely overlapping or conflicting)

### Phase 5: Desire Refinement
Through iterative exchange, agents:
- Identify conflicts and contradictions
- Propose syntheses and alternatives
- Surface hidden constraints
- Develop accommodations

**Output**: Refined set of desires (may still contain conflicts with accommodations)

### Phase 6: Desire Commitment
Agents commit to pursuing certain desires (forming intentions). Some desires may be adopted by all, some by subsets, some may remain unresolved but accommodated.

**Output**: Per-agent intention sets, plus accommodation agreements

### Phase 7: Action Planning and Execution
Standard BDI from here—agents plan how to achieve their intentions and execute plans.

**Output**: Actions that fulfill intentions while respecting accommodations

## Example: Debugging Session in Multi-Agent System

Consider a debugging task distributed across multiple agents:

**Initial State**:
- **Log Analysis Agent**: Observes error patterns
- **Code Analysis Agent**: Has knowledge of codebase structure  
- **Test Agent**: Has capability to run tests
- **Monitoring Agent**: Has runtime performance data

**Phase 1-2**: System initiates discourse because "production error rate exceeded threshold"

**Phase 3** (Context Sharing):
- Log Agent shares: "500 errors per minute, clustered in database access layer"
- Code Agent shares: "Database layer recently modified in PR #3421"
- Test Agent shares: "No tests exist for concurrent database access"
- Monitor Agent shares: "Database connection pool near capacity"

**Phase 4** (Desire Proposal):
- Log Agent proposes: "Desire: isolate specific error cause"
- Code Agent proposes: "Desire: verify PR #3421 for bugs"
- Test Agent proposes: "Desire: develop concurrency tests"
- Monitor Agent proposes: "Desire: investigate database connection management"

**Phase 5** (Desire Refinement):

Round 1:
- Code Agent: "PR #3421 changes connection pooling logic—Monitor Agent's desire is related to mine"
- Test Agent: "Concurrency tests would need database mocking—requires Code Agent's support"

Round 2:
- Emergent synthesis: "Desire: validate connection pooling changes under concurrent load"
- This wasn't proposed by any individual agent—it emerged from their interaction

Conflict:
- Test Agent: "Want to test in isolation first (slower but safer)"
- Monitor Agent: "Want to test in production-like environment (faster but riskier)"

Accommodation:
- "Run isolated tests first, then staged rollout with enhanced monitoring"

**Phase 6** (Commitment):
- **Shared intention**: Validate connection pooling behavior
- **Code Agent intention**: Analyze PR #3421 connection pooling logic
- **Test Agent intention**: Develop concurrent access tests
- **Monitor Agent intention**: Enhanced monitoring of connection pool metrics
- **Accommodation**: Sequential approach with Test Agent's isolation followed by Monitor Agent's production testing

**Phase 7** (Action): Agents execute their intentions

## The "Related and Unrelated" Desires Problem

Jenkins and Jarvis specify that discourse produces "a collection of related and unrelated desires." This is important: **not all desires that emerge from discourse are coherent or aligned**.

For agent systems, this means:

### Don't Assume Global Consistency
After discourse, agents may hold desires that aren't all mutually achievable. That's okay. The system should explicitly represent:
- Which desires are shared (collective goals)
- Which desires are individual (agent-specific goals)
- Which desires conflict (requiring accommodation)
- Which desires are independent (can be pursued in parallel)

### Represent Desire Relationships
Make relationships between desires explicit:
- "Desire A enables Desire B" (achieving A makes B easier)
- "Desire A conflicts with Desire C" (achieving both requires accommodation)
- "Desire A is more fundamental than Desire D" (A is a prerequisite or higher priority)

### Allow Partial Alignment
Agents don't need to agree on everything to coordinate effectively. They need:
- Shared understanding of each other's desires
- Agreement on critical conflicts and their accommodations
- Autonomy to pursue non-conflicting desires independently

## Boundary Conditions: When Desire Emergence Fails

### 1. Insufficient Shared Context
If agents don't have enough common understanding, discourse can't produce meaningful desires. They talk past each other.

**Symptom**: Desires proposed don't relate to each other; no synthesis emerges
**Mitigation**: Extend context-sharing phase; ensure agents have overlapping conceptual frameworks

### 2. Incompatible Goal Structures
Some agent desires may be so fundamentally different that no accommodation exists.

**Symptom**: All proposed accommodations require one agent to abandon its core purpose
**Mitigation**: Escalate to higher-level arbitration; recognize that not all agents can collaborate on all tasks

### 3. Power Imbalances Without Process
If some agents have authority to impose desires without discourse, the emergence mechanism breaks down.

**Symptom**: Discourse becomes performative; outcomes predetermined by authority
**Mitigation**: Make authority explicit and limit its scope; reserve dictatorial powers for specific situations (emergencies, security)

### 4. Overly Abstract Desires
Desires that emerge might be too abstract to guide action: "Desire: improve system quality."

**Symptom**: Agents can't form concrete intentions from stated desires
**Mitigation**: Require desire proposals to include measurability or concrete success criteria

### 5. Discourse Loops
Agents might endlessly refine desires without converging.

**Symptom**: Many discourse rounds without commitment
**Mitigation**: Implement time bounds, diminishing returns detection, or satisficing criteria

## Design Principles for Desire-Emergent Systems

### 1. Make Discourse Explicit and Observable
Don't let desire formation happen implicitly in code. Create explicit discourse logs that show:
- Who proposed what desires
- How desires evolved through interaction
- What syntheses emerged
- What conflicts were accommodated

### 2. Design for Incompleteness
Agents should be able to form intentions and act even when desires aren't fully specified or remain conflicted. Perfect clarity is rare.

### 3. Support Desire Revision
As agents learn from action outcomes, they should be able to re-enter discourse and revise desires. The emergence process isn't one-time.

### 4. Distinguish Desire Strength
Not all emergent desires are equally important. Some are core requirements, others are nice-to-haves. Make this gradation explicit.

### 5. Create Desire Taxonomies
Help agents propose and refine desires by providing categories:
- Performance desires (speed, efficiency)
- Quality desires (correctness, reliability)
- Resource desires (cost, capacity)
- Safety desires (security, compliance)

This gives structure without over-constraining emergence.

### 6. Enable Desire Inheritance
When high-level desires emerge, agents should be able to derive lower-level desires that support them. The intention hierarchy from BDI extends downward to a desire hierarchy.

## The Deeper Lesson: Goals Are Social Constructs

The most profound implication of desire emergence is that **in complex systems, goals aren't discovered or calculated—they're socially constructed**.

This challenges the optimization mindset common in AI: that there exists an objective function to maximize and agents just need to find it. Instead, this model says:
- Goals are negotiated, not given
- What counts as "good" emerges from stakeholder interaction
- Conflicting goals may both be valid
- The process of goal formation is as important as the goals themselves

For AI orchestration systems, this means:
- **Don't over-specify goals upfront**: Leave room for emergence
- **Design interaction mechanisms**: Make it easy for agents to propose, refine, and synthesize desires
- **Value process over outcome**: A messy consensus that agents own is better than an imposed optimum they resist
- **Expect evolution**: Desires today won't be desires tomorrow; build for continuous reformation

The gap between knowing and doing includes a middle step often ignored: deciding what's worth doing. That's where desires live, and in multi-agent systems operating in complex, uncertain environments, desires can't be pre-programmed—they must emerge through discourse. This paper shows how that emergence can be formally modeled while respecting its inherently social nature.