---
license: Apache-2.0
name: incident-command-decisions
description: Decision-making patterns in incident command and emergency management leadership contexts
category: Cognitive Science & Decision Making
tags:
  - incident-command
  - emergency-management
  - decision-making
  - leadership
  - crisis
---

# SKILL.md: Incident Command Decision Intelligence

## Decision Points

### Task Behavioral Level Routing
```
Novelty Assessment:
├─ High Pattern Match Confidence + Well-Precedented
│  └─ Route to SB-Level: Compiled response, no deliberation
├─ Medium Match + Parametric Variation Needed
│  └─ Route to RB-Level: Rule lookup + situational adjustment
└─ Low Match OR High Stakes + Novel Elements
   └─ Route to KB-Level: Analytical reasoning + uncertainty tracking

Time Pressure vs Accuracy Trade-off:
├─ High Time Pressure + Moderate Stakes
│  └─ RPD Mode: Pattern match → simulate first option → act
├─ Moderate Time + High Stakes
│  └─ Modified RPD: Pattern match → simulate 2-3 options
└─ Low Time Pressure + Critical Decision
   └─ Full Analysis: Generate options → compare → decide
```

### Information Uncertainty Triage
```
Information Gap Assessment:
├─ Missing Info Would Change Action
│  ├─ Acquisition Cost < Decision Delay Cost → Acquire first
│  └─ Acquisition Cost > Decision Delay Cost → Act on current estimate
├─ Missing Info Would Only Increase Confidence
│  └─ Skip acquisition → Act immediately
└─ Uncertainty is Aleatory (Random)
   └─ Build robust response → Don't wait for clarity
```

### Multi-Agent Coordination Strategy
```
Agent Count & Complexity:
├─ Single Agent Task
│  └─ Individual optimization sufficient
├─ 2-5 Agent Coordination
│  └─ Explicit handoff protocols + shared state
├─ 5+ Agents OR Cross-Domain
│  ├─ Centralized: Single coordinator + hierarchical reporting
│  └─ Distributed: Mesh communication + conflict resolution
└─ Mission-Critical Multi-Agent
   └─ Redundant coordination + failure detection + graceful degradation
```

### Escalation Trigger Points
```
IF: Pattern match confidence < 60% AND stakes = high
   → Escalate to KB-level analysis

IF: Multiple simulation failures on first option
   → Generate second option (don't enumerate all)

IF: Information gaps block action AND delay cost < error cost
   → Pause for targeted information acquisition

IF: Inter-agent coordination failure detected
   → Switch to centralized coordination mode

IF: Time pressure + no clear pattern match
   → Apply "least regret" heuristic + act
```

## Failure Modes

**1. Behavioral Level Mismatch**
- *Symptoms*: KB-level deliberation on routine tasks (over-engineering) OR SB automation on novel situations
- *Detection*: Processing time >> expected for task type OR critical errors on "simple" tasks
- *Fix*: Recalibrate novelty assessment → route to appropriate behavioral level

**2. Analysis Paralysis Under Pressure**
- *Symptoms*: Option enumeration when pattern matching would suffice, infinite information gathering
- *Detection*: Time spent on analysis > time available for action implementation
- *Fix*: Force RPD mode → pattern match → simulate first viable option → act

**3. Epistemic Cowardice**
- *Symptoms*: Refusing to act until certainty achieved, treating all uncertainty as requiring resolution
- *Detection*: Action delayed while seeking information that won't change the decision
- *Fix*: Classify uncertainty as epistemic vs aleatory → act on best current estimate

**4. Coordination Centralization Cascade**
- *Symptoms*: All decisions routing through single bottleneck agent under load
- *Detection*: Single agent queue depth growing while other agents idle
- *Fix*: Distribute authority → push decisions to edge agents → central coordination only for conflicts

**5. Retrospective Training Contamination**
- *Symptoms*: Agent behavior optimized for post-hoc rationalization rather than real-time effectiveness
- *Detection*: Perfect textbook responses that fail in messy real conditions
- *Fix*: Weight observational training data over self-reported case studies

## Worked Examples

### Example 1: Emergency System Triage

**Scenario**: Multi-agent system monitoring industrial facility. Sensor agent detects anomalous temperature spike in reactor core. Need to route to appropriate response level.

**Novice Approach**: Generate full option tree, analyze each branch, compute expected values.

**Expert Decision Process**:
1. **Situation Assessment**: "Temperature spike + reactor = potential emergency pattern"
2. **Behavioral Level**: High stakes + some precedent = RB-level (rule-based)
3. **Pattern Match**: Apply "reactor anomaly response protocol"
4. **First Option**: Immediate cooling system activation + operator alert
5. **Mental Simulation**: "Does this fail in next 3 steps?" → Cooling adequate for this temperature level
6. **Action**: Execute cooling protocol, monitor for 2 minutes
7. **Checkpoint**: If temperature drops → continue monitoring; if rises → escalate to KB analysis

**Key Decision Points Navigated**:
- Recognized emergency pattern (avoiding over-analysis delay)
- Chose RB over KB (precedented situation, established protocol exists)
- Used RPD simulation rather than option comparison (time pressure)
- Built in explicit checkpoint (uncertainty management)

**What Novice Misses**: Time cost of full analysis, adequacy of rule-based response, value of rapid initial action with planned escalation.

### Example 2: Inter-Agent Coordination Breakdown

**Scenario**: Customer service system with specialized agents (billing, technical, account management). Customer issue spans multiple domains. Initial routing to billing agent, but issue requires technical knowledge.

**Failure Pattern**: Billing agent attempts to handle technical aspects (wrong behavioral level), customer transferred multiple times, no agent has complete context.

**Expert Coordination Process**:
1. **Handoff Trigger**: Billing agent recognizes technical component beyond expertise
2. **Context Transfer**: Full state package (not just customer ID) to technical agent
3. **Coordination Mode**: Technical agent takes lead, billing agent remains in loop
4. **Shared State**: Both agents update common context store
5. **Quality Gate**: Before customer contact, verify both agents agree on solution approach

**Decision Points**:
- When to escalate vs attempt domain stretch (expertise boundary detection)
- How to transfer context without information loss (handoff protocol)
- Whether to maintain multi-agent involvement vs single owner (coordination cost/benefit)

**Failure Prevention**: Clear expertise boundaries, mandatory context transfer protocols, shared state visibility.

### Example 3: Novel Situation Under Time Pressure

**Scenario**: AI safety monitoring system encounters new failure mode not in training data. System showing anomalous behavior, potential risk to users, 5-minute window before automatic failsafe triggers.

**Expert Response Pattern**:
1. **Novelty Recognition**: "No clear pattern match, high stakes = KB-level required"
2. **Uncertainty Classification**: Epistemic (missing understanding) not aleatory (random)
3. **Information Triage**: What data would most change response? → Focus on user impact indicators
4. **Bounded Analysis**: 2-minute analysis window, then act on best estimate
5. **Conservative Bias**: When uncertain + high stakes → err toward safety
6. **Action**: Trigger controlled shutdown, alert human operators
7. **Learning Loop**: Log decision process for future pattern development

**Critical Trade-offs**:
- Analysis time vs action time (bounded deliberation)
- False alarm cost vs miss cost (conservative bias justification)
- Immediate response vs information gathering (epistemic uncertainty handling)

## Quality Gates

Task completion checklist - verify each before considering decision process complete:

- [ ] Behavioral level correctly matched to task novelty and stakes
- [ ] If time-pressured, RPD process used (pattern → simulate → act) rather than option enumeration
- [ ] Uncertainty classified as epistemic vs aleatory with appropriate response strategy
- [ ] Information gaps identified and triaged by action-relevance not confidence-improvement
- [ ] Multi-agent handoffs include complete context transfer and explicit coordination protocol
- [ ] Decision process includes explicit checkpoints for estimate updates
- [ ] Failure modes pre-identified with detection triggers and remediation plans
- [ ] Individual agent capability verified as necessary but not sufficient for system success
- [ ] Training/learning signals weighted by data source quality (observational > self-reported)
- [ ] Conservative bias applied appropriately when uncertainty + high stakes combine

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- Well-specified single-agent problems with complete information
- Routine CRUD operations or standard API integrations
- Code generation or syntax-level programming tasks
- Mathematical optimization with known objective functions
- Creative content generation or brainstorming sessions

**Delegate instead to**:
- **Standard workflows**: Use `task-decomposition` for routine multi-step processes
- **Technical implementation**: Use `system-architecture` for non-crisis system design
- **Creative synthesis**: Use `creative-problem-solving` for open-ended ideation
- **Mathematical analysis**: Use `quantitative-reasoning` for optimization problems
- **Individual skill gaps**: Use `capability-development` for single-agent improvement

**Use this skill specifically when**:
- Time pressure + uncertainty + coordination complexity combine
- Multiple expert agents must work together under constraints
- System failure modes could cascade or compound
- Decision quality degrades under operational stress
- Learning from crisis case studies or building crisis-resilient systems