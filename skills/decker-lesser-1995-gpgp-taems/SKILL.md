---
license: Apache-2.0
name: decker-lesser-1995-gpgp-taems
description: Generalized Partial Global Planning with TAEMS task structures for multi-agent coordination
category: Research & Academic
tags:
  - gpgp
  - taems
  - coordination
  - multi-agent
  - task-structures
---

# SKILL: GPGP Multi-Agent Coordination

## Overview
Build coordination mechanisms for distributed systems using task structure analysis and commitment protocols. Select minimal coordination mechanisms based on specific task relationship types rather than universal approaches.

## Decision Points

### Primary Mechanism Selection Decision Tree

**IF** analyzing new coordination requirement **THEN**:
```
1. Identify task relationship type:
   ├─ Enables (B cannot start until A completes)
   │  └─ Use strict deadline commitments, low negotiability
   ├─ Facilitates (A helps B but B can proceed without A)  
   │  └─ Use opportunistic information sharing, high negotiability
   ├─ Hinders (A competes with B for resources)
   │  └─ Use deconfliction protocols, resource allocation
   └─ Redundancy (A and B achieve same goal)
      └─ Use result sharing, early termination triggers

2. Assess relationship strength (power factor 0.0-1.0):
   ├─ > 0.7: Coordinate with full protocol
   ├─ 0.3-0.7: Coordinate with lightweight mechanisms  
   └─ < 0.3: Skip coordination, act independently
```

### Commitment Protocol Decision Tree

**IF** establishing commitment between agents **THEN**:
```
1. Determine commitment type needed:
   ├─ Hard deadline + quality requirement
   │  └─ Use C(DL(T,q,tdl)): "achieve quality q by time tdl"
   └─ Quality achievement without strict timing
      └─ Use C(Do(T,q)): "achieve quality q when feasible"

2. Set negotiability index:
   ├─ Critical path task: negotiability = 0.1-0.3
   ├─ Important but flexible: negotiability = 0.4-0.7
   └─ Nice-to-have: negotiability = 0.8-1.0

3. Establish renegotiation triggers:
   ├─ Resource availability changes > 20%
   ├─ Task priority shifts
   └─ Blocking dependencies emerge
```

### Information Sharing Decision Tree

**IF** deciding what information to share **THEN**:
```
1. Calculate sharing value:
   ├─ IF information affects another agent's task success > 10%
   │  └─ Share immediately
   ├─ IF information enables better resource allocation
   │  └─ Share if communication cost < expected utility gain
   └─ IF information is local status update
      └─ Share only to committed partners

2. Determine sharing mechanism:
   ├─ Urgent commitment changes: Direct notification
   ├─ Task structure updates: Broadcast to affected agents
   └─ Status updates: Periodic bulletin
```

## Failure Modes

### Schema Bloat
**Symptoms**: Coordination mechanisms handle too many task types, slow decision-making, high overhead
**Detection**: IF coordination overhead > 30% of total compute time OR mechanism has >20 conditional branches
**Fix**: Decompose into specialized mechanisms, each handling 1-2 relationship types

### Rubber Stamp Commitments  
**Symptoms**: Agents make commitments they cannot keep, frequent commitment breaks, cascading failures
**Detection**: IF commitment break rate > 15% OR agents consistently miss deadlines by >50%
**Fix**: Add negotiability indices, implement realistic resource estimation, create commitment verification protocols

### Information Hoarding
**Symptoms**: Agents act on stale information, redundant work, missed coordination opportunities  
**Detection**: IF agents request same information multiple times OR duplicate work detected
**Fix**: Implement strategic information sharing based on expected value calculation, create information marketplaces

### Commitment Cascade Failures
**Symptoms**: Breaking one commitment forces breaking many others, system-wide coordination collapse
**Detection**: IF single commitment break causes >5 secondary breaks OR system cannot reach quiescence
**Fix**: Design commitment networks with circuit breakers, prioritize commitments, implement graceful degradation

### Premature Coordination Termination
**Symptoms**: Coordination stops while agents still have pending work, incomplete task execution
**Detection**: IF agents terminate with unfinished commitments OR coordination ends before all constraints satisfied
**Fix**: Implement explicit quiescence detection, track commitment lifecycle states, add termination protocols

## Worked Examples

### Example 1: Microservice SLA Design

**Scenario**: Designing coordination between payment service (A) and order service (B) in e-commerce system.

**Task Analysis**:
- Relationship type: Enables (orders cannot complete without payment processing)
- Power factor: 0.9 (high - failed payments block orders completely)
- Information locality: Payment status known only to payment service

**Mechanism Selection Process**:
1. Strong enables relationship → strict deadline commitments required
2. High power factor (0.9) → full coordination protocol needed
3. Apply decision tree: Use C(DL(T,q,tdl)) commitment type

**Implementation**:
```
Payment Service commits to Order Service:
- Commitment: C(DL(ProcessPayment, 0.95, order_timeout-30sec))  
- Quality: 95% success rate
- Deadline: 30 seconds before order timeout
- Negotiability: 0.2 (low - critical path)
- Renegotiation triggers: fraud_score > threshold, payment_gateway_down
```

**Expert vs Novice**:
- **Novice**: Creates synchronous API call with fixed timeout
- **Expert**: Recognizes this as enables relationship requiring commitment protocol with renegotiation capability

### Example 2: Multi-Robot Task Scheduling with Trade-offs  

**Scenario**: Three robots (A, B, C) cleaning warehouse with overlapping patrol zones.

**Task Analysis**:
- A-B relationship: Facilitates (A's cleaning helps B but not required)  
- B-C relationship: Hinders (compete for charging station)
- A-C relationship: Redundancy (both can clean central zone)

**Decision Tree Navigation**:
1. A-B (facilitates, power=0.4) → lightweight coordination, high negotiability
2. B-C (hinders, power=0.8) → deconfliction protocol needed  
3. A-C (redundancy, power=0.6) → result sharing mechanism

**Mechanism Implementation**:
```
A-B Coordination:
- Opportunistic info sharing: "cleaned zone X at quality 0.8"
- Negotiability: 0.7 (flexible timing)

B-C Coordination:  
- Resource allocation: charging station scheduler
- Strict deconfliction: mutex on station access
- Negotiability: 0.3 (safety critical)

A-C Coordination:
- Result sharing: "central zone cleaned, terminating redundant task" 
- Early termination trigger on result quality > 0.9
```

**Trade-off Analysis**:
- Overhead cost: 12% compute time for coordination
- Benefit: 25% reduction in duplicate work, 40% improvement in charging conflicts
- Decision: Coordination value exceeds cost, implement all mechanisms

## Quality Gates

**Task Structure Analysis Complete**:
- [ ] All task relationships identified and categorized (enables/facilitates/hinders/redundancy)
- [ ] Power factors quantified for each relationship (0.0-1.0 scale)
- [ ] Information locality mapped (which agent knows what, when)
- [ ] Coordination trigger conditions specified explicitly

**Mechanism Selection Justified**:
- [ ] Decision tree applied to select coordination type for each relationship
- [ ] Overhead vs. benefit calculated for each mechanism
- [ ] Mechanisms combined appropriately (no conflicting protocols)
- [ ] Fallback behavior defined when coordination fails

**Commitment Protocol Design**:  
- [ ] Commitment types specified (Do vs. Deadline) with quality levels
- [ ] Negotiability indices assigned based on criticality (0.0-1.0)
- [ ] Renegotiation triggers defined with measurable thresholds
- [ ] Commitment lifecycle tracked (pending/active/satisfied/broken)
- [ ] Notification protocols established for commitment changes

**Information Sharing Strategy**:
- [ ] Information sharing decisions based on expected value calculation  
- [ ] Communication costs estimated and compared to benefits
- [ ] Sharing mechanisms match information urgency and scope
- [ ] Information freshness requirements specified

**Failure Mode Coverage**:
- [ ] Detection rules implemented for each major failure mode
- [ ] Recovery protocols defined for commitment breaks and cascades
- [ ] Overhead monitoring in place with alert thresholds
- [ ] Graceful degradation paths specified when coordination fails

**Performance Validation**:
- [ ] Coordination overhead measured and stays <30% of total compute
- [ ] Commitment break rate <15% under normal conditions  
- [ ] System reaches quiescence within expected time bounds
- [ ] Coordination produces measurable improvement over independent action

## NOT-FOR Boundaries

**This skill should NOT be used for**:
- **Real-time control systems**: For hard real-time requirements with microsecond precision, use deterministic scheduling instead
- **Simple request-response patterns**: For basic client-server interactions, use standard RPC/REST patterns instead  
- **Hierarchical command structures**: For military/organizational command chains, use authority-based coordination instead
- **Fully observable environments**: When all agents have complete information, use global optimization algorithms instead
- **Homogeneous agent systems**: When all agents are identical, use distributed consensus algorithms instead

**Delegate to other skills**:
- For Byzantine fault tolerance → use `byzantine-fault-tolerance` skill
- For leader election → use `distributed-consensus` skill  
- For transaction coordination → use `distributed-transactions` skill
- For load balancing → use `distributed-load-balancing` skill
- For real-time scheduling → use `real-time-systems` skill