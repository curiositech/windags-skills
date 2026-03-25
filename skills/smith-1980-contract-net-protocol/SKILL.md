---
license: Apache-2.0
name: smith-1980-contract-net-protocol
description: Distributed task allocation protocol where agents negotiate task assignments through contract bidding
category: Research & Academic
tags:
  - contract-net
  - distributed-systems
  - task-allocation
  - negotiation
  - agents
---

# SKILL.md — Big Brother Logic: Epistemic Reasoning for Multi-Agent Systems

## DECISION POINTS

### Primary Decision Tree: Responding to Partial Information States

```
Given: Agent state S, Goal G, Available actions A

IF satisfiability_check(S, G) == TRUE
├── IF current_knowledge_sufficient(S, G)
│   └── Execute planned action
├── ELSE IF gather_info_viable(S, A)
│   ├── Identify minimum vision set expansion needed
│   ├── Request targeted information from other agents
│   └── Update Kripke model with new information
│   └── Re-evaluate satisfiability_check(S, G)
└── ELSE
    └── Reconfigure agent positions/permissions to satisfy G

ELSE IF satisfiability_check(S, G) == FALSE
├── IF goal_relaxation_acceptable()
│   └── Modify G to achievable subset
└── ELSE
    └── Abort and escalate to human operator

ELSE IF satisfiability_check(S, G) == UNKNOWN
├── Attempt distributed reasoning with peer agents
├── IF still UNKNOWN after coordination
│   └── Escalate to centralized knowledge computation
└── ELSE proceed with satisfiability branch above
```

### Coordination Failure Recovery Decision Tree

```
When coordination attempt fails between agents A and B:

IF agents had same information but different actions
├── Check for common knowledge gap
│   ├── Was information publicly announced? → Use public broadcast
│   └── Was announcement verified received? → Add confirmation protocol
└── Check for conflicting vision sets → Resolve perceptual boundaries

IF agents had different information
├── Map each agent's vision set
├── Identify which agent has authoritative view
├── Update uninformed agent's Kripke model
└── Re-attempt coordination

IF coordination succeeds but action fails
├── Epistemic goal was wrong, not coordination
└── Revise knowledge requirements for this task type
```

## FAILURE MODES

### 1. "False Knowledge" Anti-Pattern
**Symptom:** Agent claims to "know" something based on incomplete information
**Detection Rule:** If agent acts on belief X but cannot rule out scenarios where ¬X, it has false knowledge
**Fix:** Map agent's vision set; expand perceptual boundaries or add verification step before action

### 2. "Mutual Knowledge Masquerade" 
**Symptom:** System assumes coordination after broadcasting message to all agents
**Detection Rule:** If coordination fails despite "shared" information, check if agents know that others received the message
**Fix:** Replace broadcast with public announcement protocol; verify common knowledge establishment

### 3. "Epistemic Goal Drift"
**Symptom:** Agents follow procedures correctly but system fails to achieve intended outcome
**Detection Rule:** If tasks complete successfully but higher-level goal fails, procedures were specified without epistemic foundation
**Fix:** Rewrite specifications as "Agent X must know Y before doing Z" instead of procedural steps

### 4. "Centralization Denial"
**Symptom:** System uses central knowledge computation but claims to be "distributed"
**Detection Rule:** If any single point of failure can corrupt all agents' knowledge states
**Fix:** Either accept centralized architecture with honest trade-off documentation, or redesign for true distributed epistemic reasoning

### 5. "Vision Set Mismatch"
**Symptom:** Agent assigned task requiring information outside its perceptual boundaries
**Detection Rule:** If agent cannot distinguish scenarios relevant to its assigned task
**Fix:** Either expand agent's vision set or reassign task to agent with appropriate perceptual access

## WORKED EXAMPLES

### Example 1: Agent Misconfiguration Recovery

**Scenario:** Three surveillance agents (A1, A2, A3) monitoring area. A2's camera malfunctions, creating coverage gap.

**Initial State:** A1 knows east sector clear, A3 knows west sector clear, A2 reports nothing (due to malfunction)
**Goal:** Verify entire area is secure before allowing human entry

**Decision Process:**
1. satisfiability_check(current_state, "area_secure") → UNKNOWN (A2's sector unverified)
2. gather_info_viable() → FALSE (A2 cannot provide info)
3. Reconfigure: A1 and A3 adjust positions to overlap A2's sector
4. New vision sets: A1 covers east + center, A3 covers west + center  
5. satisfiability_check(new_state, "area_secure") → TRUE
6. Execute: Allow human entry

**Expert Insight:** Novice would wait for A2 to recover or manually check the area. Expert recognizes this as satisfiability problem and solves via reconfiguration.

### Example 2: Common Knowledge Coordination 

**Scenario:** Financial trading agents must execute synchronized trades across markets

**Initial Attempt:** Central system broadcasts "execute trades at 14:30" to all agents
**Failure:** Some agents execute, others don't, causing market position mismatch

**Epistemic Analysis:**
- Each agent received message (mutual knowledge)
- But agents don't know others received it (no common knowledge)
- Without common knowledge, coordination fails in adversarial environment

**Solution:**
1. Replace broadcast with public announcement requiring confirmation
2. Each agent confirms receipt and sees others' confirmations
3. Only proceed when common knowledge of "all agents ready" is established
4. Result: Perfect synchronization achieved

## QUALITY GATES

Task completion requires ALL conditions satisfied:

- [ ] Vision set adequacy: Each agent can distinguish all scenarios relevant to its assigned tasks
- [ ] Common knowledge depth: For coordination-critical information, all agents know that all agents know (verified to required depth)
- [ ] Satisfiability verification: Current epistemic state provably satisfies all knowledge goals before action
- [ ] State monotonicity: New information only expands agent knowledge, never contradicts existing knowledge
- [ ] Failure mode coverage: System behavior defined for all epistemic failure cases (unknown, false knowledge, coordination failure)
- [ ] Centralization trade-off documented: If using centralized computation, failure modes and limitations explicitly stated
- [ ] Communication epistemic effect: Each message's impact on agent Kripke models formally specified
- [ ] Runtime verification active: Epistemic properties checked before irreversible actions
- [ ] Goal achievability confirmed: All epistemic goals are satisfiable given current system constraints
- [ ] Boundary condition handling: System behavior defined when goals become unsatisfiable

## NOT-FOR BOUNDARIES

**This skill should NOT be used for:**

- Single-agent reasoning tasks → Use standard planning/decision-making frameworks
- Task coordination with complete shared information → Use workflow management systems  
- Performance optimization of existing working systems → Use profiling/optimization tools
- Simple message passing between components → Use standard communication patterns
- Systems where "good enough" coordination is acceptable → Use eventual consistency patterns

**Delegate to other skills when:**

- Need real-time performance optimization → [performance-optimization-skill]
- Designing human-AI interaction workflows → [human-ai-collaboration-skill]  
- Building fault-tolerant distributed systems → [distributed-systems-resilience-skill]
- Implementing security/access control → [multi-agent-security-skill]

**Use this skill specifically when:**
- Knowledge asymmetry between agents is the core challenge
- Coordination failures occur despite agents having "correct" information
- System must guarantee epistemic properties, not just attempt coordination
- Need formal verification that agents "know enough" before acting