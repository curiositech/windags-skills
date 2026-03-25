# HTA as Springboard for Specialized Analysis: The Framework Pattern

## The Central Value Proposition

Staples (1993) reports on HTA use in nuclear reactor design where "the sub-goal hierarchy was produced through reviews of contemporary operating procedures, discussions with subject matter experts, and interviews with operating personnel." Crucially, this HTA was then used for: error analysis, interface design verification, training procedures, operating procedures, workload assessment, and communication analysis.

One analysis, six applications. This is HTA's leverage: invest once in goal decomposition, reuse for multiple analytical purposes. Stanton captures this: "HTA was never meant to be the end point in the analyses, just the start."

## Why Sub-Goal Hierarchies Enable Multiple Analyses

The sub-goal representation is analytically neutral. It describes what must be achieved without prescribing:
- **How**: Implementation strategy remains open
- **Who**: Agent assignment remains unspecified  
- **When**: Absolute timing remains flexible
- **Where**: Physical location remains abstract

This neutrality creates a substrate for specialized annotation. The tabular format provides the mechanism: additional columns capture analysis-specific information while preserving the sub-goal structure.

Consider the evolution of tabular formats:

**Original (Annett 1971)**: Description | I/F difficulties | Action difficulties

**Shepherd (1976)**: Super-ordinate | Task component | Reason for stopping | Performance notes

**Stammers & Astley (1987)**: + Information flow | Information assumed | Task classification

**Gramopadhye & Thaker (1998)**: + Allocation | Human input | Computer input | Coordination | Cognitive demand | Errors | Consequences | Duration | Frequency | Who | Knowledge | Skill level | Complexity | Criticality

Each extension adds analytical capability without changing the core sub-goal hierarchy. The framework accommodates new analyses by adding columns, not restructuring the hierarchy.

## Five Major Extension Patterns

### Pattern 1: Error Analysis (SHERPA)

**Core idea**: Each sub-goal has credible error modes determined by task type.

**Process**:
1. Classify each bottom-level sub-goal: Action, Retrieval, Checking, Communication, Selection
2. For each type, identify credible errors from taxonomy (e.g., Action errors: A1-operation too long/short, A2-mistimed, A3-wrong direction, etc.)
3. Estimate error probability (H/M/L) and criticality (H/M/L)
4. Assess recovery possibility
5. Propose design remedies

**Example** (VCR programming):
- Sub-goal 1.2 "Check clock time"
- Error C1: Omit to check clock → Consequence: VCR clock may be incorrect → Recovery: None → P: Low, C: High → Remedy: Automatic clock setting via radio signal

**Why hierarchy matters**: Errors propagate upward. If "check clock" fails (1.2), then "prepare VCR" fails (1), then entire programming task fails (0). The hierarchy traces error impact.

**Agent system implication**: For each skill invocation, what error modes are credible? What happens if this skill fails? Can we detect failure? Can we recover? Error analysis requires the goal context that hierarchy provides—knowing what a sub-goal is trying to achieve tells you what it means to fail.

### Pattern 2: Interface Requirements (Stammers & Astley)

**Core idea**: Each sub-goal requires information input, produces information output, and assumes prerequisite knowledge.

**Added columns**:
- Information flow to interface (→)
- Information flow from interface (←)
- Information assumed (prerequisite knowledge)
- Task classification (monitoring, procedure, fault diagnosis, decision making, problem solving, operation)

**Example** (coal preparation plant):
- Sub-goal 2 "Run plant normally"
- Info flow: ← plant operation & monitoring, → control information
- Assumed: knowledge of plant flows and operational procedures
- Classification: operation + monitoring

**Why hierarchy matters**: Information flows between levels. Sub-goal 2.3 might produce output that becomes input to sub-goal 2.4. The hierarchy traces information dependencies.

**Agent system implication**: What information does each skill need? What does it produce? What domain knowledge must agents possess? Interface requirements are about information architecture—the hierarchy shows information flow from sensing (bottom) through processing (middle) to decision (top).

### Pattern 3: Function Allocation (Marsden & Kirby)

**Core idea**: Each sub-goal can be assigned to human, computer, or human-computer collaboration based on capabilities and constraints.

**Process**:
1. Decompose until sub-goals are allocation candidates (just before implementation details)
2. For each sub-goal, evaluate criteria: complexity, frequency, consequences of error, required expertise, need for judgment, workload, etc.
3. Assign: H (human only), H-C (human with computer support), C-H (computer with human oversight), C (computer only)
4. Review overall allocation for job satisfaction, error potential, workload balance, cost-effectiveness
5. Iterate if conflicts found

**Example** (brewery production):
- Sub-goal 1.1 "Forecast demand": Assigned H (requires judgment about market conditions)
- Sub-goal 1.2.2 "Adjust for production min/max": Assigned C (algorithmic constraint checking)
- Sub-goal 1.3.5 "Negotiate with suppliers": Assigned H (requires relationship management)

**Why hierarchy matters**: Allocation at wrong level causes problems. Allocate too high (entire super-ordinate goal to human or computer) and you miss opportunities for collaboration. Allocate too low (individual button presses) and you over-specify implementation. The hierarchy lets you find the right level.

**Agent system implication**: Which sub-goals map to AI skills? Which need human oversight? Which need human-AI collaboration? Allocation analysis reveals where automation helps, where it hinders, and where hybrid approaches work best. The hierarchy shows allocation patterns—maybe all "monitoring" sub-goals are automated but "decision-making" sub-goals need human confirmation.

### Pattern 4: Team Coordination (Annett et al)

**Core idea**: Each sub-goal involves specific team members engaged in communication and coordination activities.

**Added information**:
- Team member assignment per sub-goal
- Communication: send information, receive information, discussion
- Coordination: collaboration (work sharing), synchronization (timing)
- Teamwork description (narrative of interaction pattern)

**Example** (anti-submarine warfare):
- Sub-goal 1.1.2.2 "Check chart for known feature"
- Team members: Sonar operator, Active Sonar Director, Principal Warfare Officer, Officer of Watch, Action Picture supervisor, Electronic Warfare team, Radar team, Missile Director
- Communication: Sonar operator → Director → PWO calls "Chart check, poss. sub BRG/RG" → Officer plots → Director directs Sonar Controller → All check and report results
- Coordination: Parallel checking (Electronic Warfare, Radar, Visual all check simultaneously)

**Why hierarchy matters**: Coordination happens at different levels. Super-ordinate goal "Identify threats" requires continuous information sharing. Sub-goal "Check chart" requires synchronous multi-agent action. The hierarchy shows where tight coordination is needed vs. loose coupling.

**Agent system implication**: Which agents own which sub-goals? What information flows between them? Where must they synchronize? Where can they work independently? Team analysis reveals the coordination architecture—not just "these agents collaborate" but specifically how and when.

### Pattern 5: Workload Assessment

**Core idea**: Each sub-goal has duration, frequency, and cognitive demand that accumulates to total workload.

**Added columns**:
- Duration (time estimate)
- Frequency (how often performed)
- Cognitive demand (low/medium/high)
- Physical demand
- Concurrent activities

**Analysis**:
- Sum duration × frequency for total time load
- Identify peaks where multiple high-demand sub-goals occur simultaneously
- Find bottlenecks where critical path is overloaded
- Assess if human/agent has capacity

**Why hierarchy matters**: Workload propagates upward but distributes downward. If super-ordinate goal has 10 sub-goals, workload is sum of subordinates. But some subordinates may be parallel (divide workload) vs. sequential (add workload). The hierarchy with plans shows workload distribution.

**Agent system implication**: What's the computational budget? Where are processing bottlenecks? Can we parallelize high-workload sub-goals? Should we allocate more resources or simplify requirements? Workload analysis identifies where system will struggle before you deploy.

## The Extension Pattern: Systematic Annotation

All five extensions follow the same pattern:

1. **Take sub-goal hierarchy as given**: Don't restructure; analyze existing decomposition
2. **Add analytical columns/annotations**: Extend tabular format or create complementary representation
3. **Analyze each sub-goal systematically**: Work through hierarchy level by level
4. **Trace relationships through hierarchy**: How do errors/information/workload propagate?
5. **Synthesize findings at super-ordinate levels**: What do subordinate analyses imply for super-ordinates?
6. **Propose interventions**: Based on analysis, what should change?

This systematic approach is why HTA enables rigorous analysis. You're not hand-waving about "possible errors" or "workload concerns"—you're analyzing each sub-goal against explicit criteria and tracing implications through structure.

## Combining Multiple Analyses: The Mega-Table

Gramopadhye & Thaker (1998) demonstrate combining allocations, information requirements, errors, consequences, duration, frequency, agent assignment, knowledge requirements, skill level, complexity, and criticality in one table.

Why do this? Because design decisions interact:
- **Allocation affects workload**: Assigning sub-goal to computer changes cognitive demand on human
- **Errors affect interface**: High-error sub-goals need better information display  
- **Complexity affects allocation**: Highly complex sub-goals may need human judgment
- **Frequency affects criticality**: Frequent low-consequence errors may accumulate to high overall cost

The mega-table makes trade-offs visible. Example: Sub-goal X is high complexity, high criticality, high frequency. Analysis shows:
- Should assign to experienced operator (allocation)
- Needs comprehensive information display (interface)
- High error potential (needs verification step)
- Creates workload peak when concurrent with sub-goal Y (needs scheduling)

Without combined view, you optimize locally and create problems globally. With combined view, you see system-level patterns.

For agent orchestration: don't analyze error prediction separately from workload separately from allocation. Analyze together. The sub-goal that's high-error-risk might also be high-workload, suggesting you should either allocate to more capable agent or decompose further to reduce complexity.

## When Extensions Conflict: The Design Trade-Off Problem

Different analyses recommend different solutions:

**Error analysis says**: Decompose sub-goal X further to identify specific error modes  
**Workload analysis says**: Sub-goal X is already creating bottleneck; further decomposition increases coordination overhead

**Allocation analysis says**: Assign sub-goal Y to human for judgment  
**Interface analysis says**: Information required for sub-goal Y not available in human-accessible form

**Team analysis says**: Sub-goal Z requires synchronization of three agents  
**Performance analysis says**: Synchronization overhead makes sub-goal Z too slow

These conflicts are features, not bugs. They reveal design trade-offs that must be explicitly resolved:
- Accept higher error risk to maintain workload?
- Redesign information architecture to enable human allocation?
- Loosen synchronization requirements or allocate more time?

The sub-goal hierarchy provides a common framework for negotiating trade-offs. Rather than arguing abstractly about "reliability vs. efficiency," you argue concretely about "sub-goal 2.3.4 needs tighter error checking, but that adds 200ms latency—can we afford it in the context of super-ordinate goal 2.3's timing requirements?"

## The Limitation: Analysis Depth vs. Analysis Breadth

You can analyze deeply (many extensions on small hierarchy) or broadly (few extensions on large hierarchy) but not both exhaustively. The analytical space is too large.

Practical approach:
1. **First pass**: Broad, shallow analysis across entire hierarchy to identify hot spots
2. **Second pass**: Deep analysis on critical sub-goals identified in first pass
3. **Third pass**: Validate that deep analysis conclusions don't create problems elsewhere

This is analytical economy again: focus effort where it matters. Not every sub-goal needs error prediction, workload assessment, interface specification, and allocation analysis. But high-P×C sub-goals might need all of them.

## Meta-Lesson: Reusable Structure Enables Analytical Leverage

Software engineering has design patterns. HTA's contribution is an analytical pattern: decompose problem into goal hierarchy, then apply systematic analytical extensions.

This pattern transfers beyond ergonomics:
- **Software architecture**: Decompose system into modules (hierarchy), then analyze coupling (information flow), failure modes (error analysis), performance (workload), deployment (allocation)
- **Project planning**: Decompose project into work packages (hierarchy), then analyze dependencies (plans), risks (errors), resource needs (workload), assignments (allocation)
- **Business process**: Decompose process into activities (hierarchy), then analyze data flow (information), bottlenecks (workload), automation opportunities (allocation), quality risks (errors)

The pattern is: create neutral logical structure, then layer analytical perspectives. The structure provides stability; the perspectives provide insight.

For AI agent orchestration, this means: invest in clean goal decomposition upfront, then you can:
- Route tasks to appropriate agents (allocation)
- Predict failure modes (error analysis)
- Estimate compute requirements (workload)
- Design monitoring and observability (information flow)
- Optimize coordination (team analysis)

All from the same sub-goal hierarchy. That's leverage. That's why HTA endures after 37 years. The framework enables analytical flexibility without requiring analytical reinvention.