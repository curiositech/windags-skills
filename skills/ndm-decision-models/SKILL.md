---
license: Apache-2.0
name: ndm-decision-models
description: Models of naturalistic decision-making including recognition-primed decisions, sensemaking, and mental simulation
category: Cognitive Science & Decision Making
tags:
  - ndm
  - decision-models
  - recognition-primed
  - expertise
  - heuristics
---

# Naturalistic Decision Making Models for Agent Systems

## Decision Points

### Primary Branch: Time Pressure + Domain Familiarity → Decision Mode

```
Agent faces decision task
├── High time pressure (< 5 seconds to decide)
│   ├── Domain is familiar/trained → Use RPD mode
│   │   ├── Clear situation pattern? → Generate action, simulate, execute
│   │   └── Unclear pattern? → Generate best guess action, short simulation, act
│   └── Domain is novel/untrained → Use constrained analytical mode
│       ├── Can identify 2-3 viable options quickly? → Compare those only
│       └── Cannot quickly identify options? → Escalate to human/expert
└── Low time pressure (> 30 seconds to decide)
    ├── High stakes + reversible decision → Use RPD with extended simulation
    ├── High stakes + irreversible decision → Use analytical mode with expert review
    └── Low stakes → Use RPD mode regardless of domain familiarity
```

### Secondary Branch: Action Validation During Execution

```
Agent generates action via RPD
├── Mental simulation passes cleanly → Execute immediately
├── Mental simulation shows minor issues → Modify action, simulate again
├── Mental simulation shows major failure → Generate different action
└── Cannot simulate (insufficient domain model) → Revert to analytical mode
```

### Tertiary Branch: Multi-Agent Coordination

```
Multiple agents must coordinate
├── Agents have shared situation model → Proceed with individual RPD
├── Agents disagree on situation assessment → Stop, build shared model first
└── Situation model unclear → Designate lead agent for situation assessment
```

## Failure Modes

### 1. Analysis Paralysis in Pattern-Recognizable Situations
**Detection Rule:** Agent spends >10 seconds comparing obvious alternatives when first option would work.
**Symptoms:** Over-enumeration of options, probability calculations for clear cases, delayed response to time-critical situations.
**Fix:** Check if situation matches trained patterns. If yes, force RPD mode; generate first workable action and execute after brief simulation.

### 2. Recognition Bias in Novel Domains  
**Detection Rule:** Agent confidently executes actions in unfamiliar domains without simulation or verification.
**Symptoms:** Fast decisions in areas outside training data, no uncertainty signaling when domain shifts, pattern matching to superficially similar but structurally different situations.
**Fix:** Add domain boundary detection. When domain novelty detected, require analytical mode or human consultation.

### 3. Simulation Bypass Under Pressure
**Detection Rule:** Agent executes first generated action without mental simulation when time pressure increases.
**Symptoms:** Higher error rates under time pressure, no modification of initially generated actions, inability to catch obvious flaws in plan.
**Fix:** Implement minimum simulation requirement even under extreme time pressure. Better to act 2 seconds later with simulation than immediately without.

### 4. Situation Model Lock-in
**Detection Rule:** Agent maintains initial situation assessment despite contradictory evidence emerging during execution.
**Symptoms:** Continued execution of failing plan, ignoring feedback that invalidates situation model, escalating commitment to wrong diagnosis.
**Fix:** Build expectancy violation monitoring. Force situation reassessment when 2+ predictions fail to materialize.

### 5. Decision Support Tool Override
**Detection Rule:** Agent ignores or works around decision support tools that require analytical processing.
**Symptoms:** Consistent bypass of formal decision frameworks, resistance to using probability estimation tools, degraded performance when tools are mandatory.
**Fix:** Redesign tools to support situation assessment and pattern recognition rather than option comparison.

## Worked Examples

### Example 1: Emergency Response Agent - RPD Success

**Scenario:** Building fire alarm triggers emergency response agent. Sensors show: smoke detector C-wing, temperature spike, no water flow alerts, 14:30 weekday.

**Agent's RPD Process:**
1. **Recognition:** Pattern matches to "office fire, business hours, sprinkler system intact"
2. **Action Generation:** Evacuate C-wing, dispatch fire crew, prepare building-wide evacuation
3. **Mental Simulation:** C-wing evacuation takes ~3 minutes, fire crew arrival ~7 minutes, if fire spreads beyond C-wing need full evacuation. Simulation passes.
4. **Execution:** Issues C-wing evacuation, dispatches crew

**What Novice Would Miss:** Would spend time calculating probability fire spreads, comparing evacuation vs. wait-and-see options, analyzing sensor readings. By recognition, expert agent knows: office fire + working sprinklers = evacuate zone first, full building only if escalation.

**Outcome:** Fire contained to origin room. Total evacuation time: 4 minutes. Analytical approach would have taken 8-12 minutes just for decision.

### Example 2: Trading Agent - Recognition Failure

**Scenario:** Market volatility spike during Asian session. Agent sees pattern similar to "flash crash" from training data: rapid 2% drop in 5 minutes, high volume, news feed shows "regulatory concern."

**Agent's Flawed RPD:**
1. **Recognition:** Matches to "flash crash recovery" pattern 
2. **Action Generation:** Buy the dip, expecting rapid rebound
3. **Mental Simulation:** Predicts 1-2% recovery within 30 minutes
4. **Execution:** Takes large long position

**What Expert Would Catch:** "Regulatory concern" during Asian session is structurally different from technical flash crashes. Domain shift not recognized. Should have triggered analytical mode or expert consultation.

**Outcome:** Further 3% drop as regulatory news proves substantial. Loss: $2.3M.

**Fix Applied:** Added domain boundary detection for "regulatory news" keyword that forces analytical mode regardless of price pattern recognition.

### Example 3: Multi-Agent Coordination - Situation Model Disagreement

**Scenario:** Software deployment agents preparing production release. Agent A sees "standard deployment" pattern, Agent B sees "high-risk deployment" pattern from same signals: 47 code changes, 3 database migrations, 2 new external dependencies, Friday 4PM release window.

**Decision Process:**
1. **Detect Disagreement:** Agents generate different actions (A: proceed normally, B: delay to Monday)
2. **Stop Individual RPD:** Both agents halt action generation
3. **Build Shared Model:** Agent A weights "only 47 changes, tested migrations"; Agent B weights "Friday release + external deps"
4. **Resolution:** Shared assessment: "Standard scope but risky timing" 
5. **Coordinated Action:** Proceed with deployment but extend monitoring window and prepare rapid rollback

**What Would Fail:** If agents proceeded with individual RPD, would get coordination failure. Agent A deploys while Agent B holds back monitoring resources.

## Quality Gates

Agent deployment readiness checklist:

- [ ] Agent correctly identifies domain boundaries and switches decision modes appropriately
- [ ] Agent can generate workable actions within time constraints for 90%+ of trained scenarios
- [ ] Agent performs mental simulation before execution and catches major failure modes
- [ ] Agent updates situation assessment when initial predictions fail (expectancy violation response)
- [ ] Agent escalates to analytical mode or human consultation when facing novel/untrained situations
- [ ] Agent coordinates effectively with other agents by establishing shared situation models first
- [ ] Agent's first-generated action is workable (not necessarily optimal) in 85%+ of test cases
- [ ] Agent's decision latency is appropriate for time pressure context (fast for urgent, thorough for high-stakes)
- [ ] Agent ignores or bypasses decision support tools that interfere with recognition-based processing
- [ ] Agent maintains performance under time pressure without complete simulation bypass

## NOT-FOR Boundaries

**This skill should NOT be used for:**

- **Novel problem domains:** Use analytical-reasoning instead for completely unfamiliar situations
- **Single high-stakes irreversible decisions:** Use formal-decision-analysis for "bet the company" choices
- **Mathematical optimization problems:** Use optimization-algorithms for resource allocation, scheduling, routing
- **Regulatory compliance decisions:** Use rule-based-systems for legal/compliance requirements where process traceability is mandatory
- **Creative/generative tasks:** Use design-thinking or creative-problem-solving for open-ended innovation
- **Research and discovery:** Use scientific-method for hypothesis testing and knowledge creation

**Delegate instead:**
- For mathematical problems with clear optimization criteria → optimization-algorithms
- For creative ideation → design-thinking  
- For regulatory compliance → rule-based-systems
- For novel domains with no training data → analytical-reasoning
- For high-stakes irreversible decisions → formal-decision-analysis