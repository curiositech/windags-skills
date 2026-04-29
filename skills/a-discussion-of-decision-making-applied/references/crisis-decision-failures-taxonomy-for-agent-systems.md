# A Taxonomy of Crisis Decision Failures: What Breaks When Systems Face Hard Problems

## Introduction: The Contingency Approach's Warning System

While the Recognition-Primed Decision model offers an optimistic view of expert performance — what experts do *well* — the sociological Contingency Approach (CA) analyzed by Njå and Rake catalogs the systematic ways that decision making *breaks down* in crisis conditions. This catalog is not an indictment of individual commanders; it is a structural analysis of failure modes that emerge from the interaction of crisis conditions with human cognitive and organizational constraints.

For agent systems, this taxonomy is invaluable. Each failure mode identified in the CA literature corresponds to a specific failure mode in multi-agent systems operating under uncertainty, time pressure, and information degradation. Understanding these failure modes is the prerequisite for designing systems that avoid them.

## The Master List: Eight Systematic Failure Modes

Rosenthal et al.'s (1989) contingent decision path perspective, as synthesized by Njå and Rake, identifies eight characteristic failure modes in crisis decision making. Each is worth examining in depth.

### Failure Mode 1: Centralization of Decision Making

**The pattern**: "Decision-making becomes increasingly centralised."

In organizational crisis response, what begins as a distributed, multi-agent operation progressively collapses toward a single decision point — the incident commander — who becomes a bottleneck for all critical decisions. This centralization is not simply a poor design choice; it is an emergent property of high-stakes situations. Subordinate agents (human responders) defer decisions upward when stakes are high, because the consequences of being wrong feel personally catastrophic. The result is a system that has nominally distributed capability but operationally centralized throughput.

**Agent system translation**: In multi-agent orchestration, this failure mode appears when agents under pressure route all decisions to the coordinating agent rather than exercising their own bounded authority. The coordinating agent becomes a bottleneck — all sub-tasks await its approval, its bandwidth limits throughput, and its failure (or overload) collapses the entire system.

**Mitigation**: Explicit authority delegation with hard boundaries. Sub-agents must be given genuine authority to make specific classes of decisions without escalation, with clear criteria for what *does* require escalation. The escalation boundary must be enforced both upward (sub-agents don't escalate unnecessarily) and downward (the coordinating agent doesn't re-centralize authority it has delegated).

### Failure Mode 2: Collapse of Formal Procedures

**The pattern**: "Formal rules and procedures give way to informal processes and improvisation."

This is paradoxical: the situations for which procedures were most carefully developed (major crises) are precisely the situations in which procedures are most likely to be abandoned. The cause is that formal procedures are designed for anticipated scenarios, and major crises are characterized by features that were not fully anticipated. When the procedure doesn't quite fit, agents improvise — which may or may not produce better outcomes than following an imperfect procedure.

**Agent system translation**: This failure mode appears when skill invocations begin to deviate from their defined interfaces under pressure — agents modify their input/output contracts, bypass established validation steps, or invoke skills in unauthorized combinations. The system begins operating in a way that differs from its designed behavior, making the actual operation unpredictable and hard to monitor.

**Mitigation**: Procedures must be designed with explicit "graceful degradation" modes — how to operate when the full procedure isn't applicable. Agents should have clear criteria for when improvisation is authorized and what constraints govern it. Post-incident logging should capture deviations from standard invocation patterns for retrospective analysis.

### Failure Mode 3: Bureaucratic Politics

**The pattern**: "Bureaucratic politics flourish."

In multi-organizational crisis response, different agencies with different mandates, cultures, and leadership structures must coordinate. But the crisis simultaneously increases each agency's need to protect its own jurisdiction and authority. The result is political behavior — information hoarding, authority disputes, public positioning — that degrades coordination at the moment coordination is most critical.

**Agent system translation**: In multi-agent systems, this failure mode appears as *resource competition* and *interface disputes* — agents optimizing for their own performance metrics at the expense of system-level outcomes, agents in different subsystems with incompatible interfaces that nobody resolves, agents that hold intermediate results rather than sharing them because sharing creates dependency.

**Mitigation**: System-level metrics that dominate individual agent metrics. Agents must be rewarded for system-level outcomes, not individual throughput. Interface standards must be enforced architecturally, not by convention. Information sharing between agents must be the default, not the exception.

### Failure Mode 4: Information Volume and Speed Overload

**The pattern**: "There is a considerable increase in the volume and speed of upward and downward communications. Crises demand rapid information processing, but also very careful information processing."

The tension is acute: more information is generated per unit time in crisis conditions, and more information is needed per unit time to make good decisions — but human (and agent) bandwidth for processing information does not increase. The result is selective processing, which introduces systematic distortions (what gets through is what confirms existing hypotheses) and latency.

**Agent system translation**: When agent systems scale up in response to a complex problem, the orchestrating agent's communication bandwidth becomes the binding constraint. If it must read and process all messages from all sub-agents, and those sub-agents are generating high-volume outputs, the orchestrator is necessarily processing selectively — and what it selects may not be what matters most.

**Mitigation**: Active filtering at the sub-agent level (sub-agents summarize and prioritize before reporting up), explicit information prioritization protocols (high-criticality signals get through regardless of volume), and bandwidth-aware communication design where orchestrators explicitly manage their attention rather than assuming they can process everything.

### Failure Mode 5: Source Priority Over Content Quality

**The pattern**: "Decision makers tend to give priority to the source of information instead of its contents. It may become impossible to acquire the most crucial aspects of the crisis."

Under time pressure and cognitive load, evaluating the quality of each piece of information is expensive. The cheap heuristic is to evaluate the source: information from trusted, authoritative, proximate sources gets through; information from unknown, peripheral, or low-status sources gets discounted. This heuristic works reasonably well under normal conditions but fails badly in crisis conditions, where the most critical information may arrive from unexpected sources (a civilian who witnessed the initial incident, a junior responder who spotted a structural anomaly).

**Agent system translation**: This is the problem of *provenance-based trust* in agent pipelines. If downstream agents weight upstream agent outputs by the upstream agent's track record or position in the hierarchy rather than by the quality of the current output, the pipeline will systematically discount valuable information from agents with shorter histories or lower positions.

**Mitigation**: Content-based evaluation that supplements source-based trust. Every agent output should carry quality indicators derived from the content itself (internal consistency, consistency with other sources, specificity of claims) alongside source-based trust scores. High-content-quality signals from low-trust sources should trigger verification rather than automatic discounting.

### Failure Mode 6: Anchoring to Initial Situation Definition

**The pattern**: "Decision makers can have extreme difficulty in redefining the situation. They stick to the chosen course of action. Decision makers tend to focus on one goal and one particular way of achieving that goal."

This is perhaps the most dangerous failure mode in high-stakes situations: once an initial situation model has been formed and action has been committed, it becomes very difficult to update the model when new information contradicts it. The commitment to the initial course of action creates psychological and organizational momentum that resists correction. The Piper Alpha disaster is the canonical example: managers who had classified the situation as manageable continued treating it as manageable even as contradicting evidence mounted.

**Agent system translation**: In agent systems, this failure mode appears as *plan commitment without revision triggers*. Once a plan is generated and execution begins, the system continues executing even when intermediate results are signaling that the plan is failing. The system has committed to a course of action and lacks the mechanism to detect that the course of action is wrong.

**Mitigation**: Every plan in execution should have explicit *revision triggers* — conditions under which the plan is suspended and the situation reassessed from scratch. These triggers should be defined at plan generation time, not discovered retrospectively. The revision process should not be incremental adjustment but full situation reassessment, because the failure mode being guarded against is one where the initial situation model is wrong, not where the plan has small execution errors.

### Failure Mode 7: Groupthink

**The pattern**: "Decision makers in crisis units can yield to groupthink — the preservation of group harmony overrides the group's ability to critically assess decision problems and choose an adequate course of action."

Groupthink (Janis, 1982) is the collapse of critical evaluation within a decision-making group under social pressure. In crisis conditions, the social pressure toward consensus is intense: there is no time for extended debate, dissenting voices feel they are impeding the response, and the emotional intensity of the situation makes disagreement feel disloyal. The result is superficial agreement on a course of action that nobody actually believes is optimal, with critical objections suppressed.

**Agent system translation**: In multi-agent systems, groupthink appears when agents converge on a collective assessment or plan without independent evaluation. If agents are sharing intermediate outputs and updating on each other before forming their own assessments, the eventual collective assessment will be more internally consistent but less independently validated. The system effectively loses the diversity of perspective that makes collective intelligence valuable.

**Mitigation**: Architectural independence of assessment. When agents are tasked with evaluating the same situation, they should form initial assessments independently before comparing notes. If a coordinating agent is seeking validation of a plan, it should receive independent assessments from sub-agents, not sequentially updated opinions that have already converged. At least one agent in any critical evaluation should be explicitly tasked with finding reasons the current plan is wrong.

### Failure Mode 8: Inability to Acquire Crucial Information

**The pattern**: A corollary to the overload problem — while the channel is flooded with low-value information, "it may become impossible to acquire the most crucial aspects of the crisis."

This is the information triage failure: the specific information most needed for the critical decision is precisely the hardest to obtain. In crisis environments, this happens because the most critical information often requires accessing dangerous, difficult, or politically sensitive sources. The easier-to-obtain information fills the channel instead.

**Agent system translation**: The pipeline produces large volumes of easily generated information (surface-level analysis, background information, general context) while failing to acquire the specific, targeted information that would most improve the decision quality. Agents generate output because they have bandwidth, not because the output is what the system needs.

**Mitigation**: Decision-driven information requests. Before initiating information gathering, the system should explicitly model what information would most change the current decision, and target information acquisition at those gaps. Agents should be evaluated on the decision-relevance of their outputs, not on volume or comprehensiveness.

## The Compound Failure: When Multiple Modes Interact

The most dangerous crisis situations are not those where one failure mode appears. They are those where multiple failure modes interact and reinforce each other.

Consider the compound failure: centralization occurs (Mode 1), which increases the information load on the central decision maker, who defaults to source priority (Mode 5) to manage the load, which means critical peripheral information is discarded; simultaneously the group converges on an initial situation definition (Mode 7), which triggers anchoring (Mode 6), so new information that contradicts the initial assessment is not just discarded by the overloaded central decision maker but is actively suppressed as a threat to group consensus.

In this compound state, the system continues to operate with high confidence and high activity — but the activity is systematically wrong. There is no visible signal that something is failing; everything looks busy and purposeful. The failure only becomes visible when outcomes diverge catastrophically from expectations.

For agent system design, the most important implication is that **failure mode detection must be architectural, not incidental**. The system must actively monitor for the signatures of each failure mode:
- Is decision throughput disproportionately concentrated in one agent? (Mode 1)
- Are standard skill invocation patterns being bypassed? (Mode 2)
- Are agents sharing critical results? (Mode 3)
- Is orchestrator bandwidth saturated? (Mode 4)
- Is content quality evaluation active alongside source trust? (Mode 5)
- Are revision triggers being monitored? (Mode 6)
- Are agent assessments genuinely independent? (Mode 7)
- Is information acquisition targeted at decision-critical gaps? (Mode 8)

None of these monitors are glamorous. None of them directly solve the primary task. But they are the difference between a system that degrades gracefully under pressure and one that fails catastrophically at the exact moment when performance matters most.