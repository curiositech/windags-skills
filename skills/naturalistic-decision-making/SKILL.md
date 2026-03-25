---
license: Apache-2.0
name: naturalistic-decision-making
description: Field-based research methodology studying expert decision-making in real-world high-stakes environments
category: Cognitive Science & Decision Making
tags:
  - ndm
  - decision-making
  - expertise
  - field-research
  - cognition
---

# Naturalistic Decision Making (Klein)

## Decision Points

### Primary Decision Tree: How to Process Any Situation

```
SITUATION ENCOUNTERED
├─ Do I recognize this pattern?
│  ├─ YES: Strong pattern match (>80% confidence)
│  │  ├─ Is this time-critical? (problem grows exponentially)
│  │  │  ├─ YES → Execute typical action immediately
│  │  │  └─ NO → Mental simulation first, then execute
│  │  └─ Pattern suggests action A
│  ├─ PARTIAL: Weak pattern match (30-80% confidence)
│  │  ├─ High stakes?
│  │  │  ├─ YES → Gather 2-3 key cues, re-assess pattern
│  │  │  └─ NO → Execute most likely action, monitor expectancies
│  │  └─ Try most probable pattern's action with high monitoring
│  └─ NO: Novel situation (<30% confidence)
│     ├─ Time pressure?
│     │  ├─ HIGH → Use closest partial pattern, flag for learning
│     │  └─ LOW → Switch to analytical decision-making mode
│     └─ Fallback to formal analysis, document for pattern library
```

### When Building Agent Systems

```
DESIGN DECISION
├─ Orchestration needed?
│  ├─ Central coordinator approach
│  │  └─ AVOID: Creates bottleneck, ignores parallel pattern matching
│  └─ Situation recognition routing
│     └─ Route to specialist based on pattern match confidence
├─ Decision support tool?
│  ├─ Formal framework (matrices, utility analysis)
│  │  └─ USE ONLY: Novel situations, stable conditions, time available
│  └─ Pattern-based with simulation
│     └─ DEFAULT: Build pattern libraries + mental simulation capability
└─ Training approach?
   ├─ Procedural scripts
   │  └─ AVOID: Real situations don't match scripts
   └─ Pattern recognition + case exposure
      └─ BUILD: Varied scenario libraries with outcome feedback
```

### Mental Simulation Decision Process

```
ACTION CANDIDATE IDENTIFIED
├─ Run forward simulation in context
│  ├─ Obstacles appear?
│  │  ├─ Minor → Adapt action, continue simulation
│  │  └─ Major → Try next-typical action from pattern
│  ├─ Unexpected consequences?
│  │  ├─ Acceptable → Proceed with adapted action
│  │  └─ Unacceptable → Flag pattern mismatch, reassess situation
│  └─ Simulation runs clean?
│     └─ Execute action (satisficing achieved)
└─ Simulation fails completely?
   └─ Either wrong pattern match OR truly novel situation
```

## Failure Modes

### Pattern Misapplication
**Symptoms**: Actions consistently fail despite confident execution; expectancy violations frequent
**Diagnosis**: Forcing pattern matches on novel situations or using degraded patterns
**Fix**: Build explicit novelty detection; when confidence <30%, switch to analytical mode
**Detection Rule**: If expectancy violation rate >20% with same pattern, pattern is wrong or degraded

### Analysis Paralysis in Time-Critical Situations
**Symptoms**: Seeking more information while problem compounds; formal tools used in fire scenarios
**Diagnosis**: Treating all decisions as optimization problems regardless of problem dynamics
**Fix**: Classify situations by growth rate; if exponential, satisfice immediately
**Detection Rule**: If you're gathering more data while the problem size is doubling, you're in wrong mode

### Central Planning Bottleneck
**Symptoms**: Single orchestrator overwhelmed; sequential processing of parallel-eligible tasks
**Diagnosis**: Designing coordination around decomposition rather than situation recognition
**Fix**: Route by pattern match to specialists; use shared mental models for coordination
**Detection Rule**: If one component processes >60% of decisions, you have a bottleneck

### Optimization Addiction
**Symptoms**: Always generating multiple options; refusing "good enough" solutions
**Diagnosis**: Assuming more analysis always improves outcomes regardless of context
**Fix**: Default to satisficing; optimize only when conditions are stable and stakes justify cost
**Detection Rule**: If you're comparing options when first option passes mental simulation, you're over-analyzing

### Expectancy Blindness
**Symptoms**: Surprised by developments that patterns should have predicted; late problem detection
**Diagnosis**: Using patterns for action retrieval but not for monitoring/prediction
**Fix**: Every pattern must include expectancies; violations trigger immediate reassessment
**Detection Rule**: If problems develop without early warning signs, expectancy monitoring is broken

## Worked Examples

### Example 1: Fireground Commander Decision

**Situation**: Structure fire reported, first units arriving
**Cue Recognition**: Single-story residential, smoke from windows, no visible flames
**Pattern Match**: "Typical house fire, interior attack viable" (85% confidence)

**Decision Process**:
1. **Pattern retrieval**: Interior attack with 1¾" line, primary search
2. **Mental simulation**: Run scenario forward
   - Enter through front door → smoke banking down → visibility near floor
   - Advance down hallway → heat building but manageable
   - Locate fire room → apply water → knock down visible
3. **Expectancy check**: Should see steam, heat reduction, improved visibility
4. **Execute**: "Engine 1, interior attack, primary search Alpha side"

**What novice misses**: 
- Doesn't simulate heat buildup progression
- Misses expectancy that smoke should lift after knockdown
- Would generate multiple options (exterior attack, defensive, etc.) instead of simulating most likely

**What expert catches**:
- Simulation reveals need for backup line
- Sets expectancy for 3-minute improvement or reassess
- Action matches situation assessment, no option comparison needed

### Example 2: Agent Orchestration Design

**Situation**: Multi-agent system needs task routing for customer support
**Cue Recognition**: Variable complexity queries, specialist domains, time sensitivity mix
**Pattern Match**: "Situation recognition routing" not "central task decomposition"

**Decision Process**:
1. **Avoid central planner**: Would create bottleneck, lose parallel processing
2. **Mental simulation of routing approaches**:
   - Central orchestrator: Queue builds, specialists wait, serial processing
   - Pattern-based routing: Queries go direct to specialist based on content recognition
3. **Expectancy**: Routing accuracy >90%, specialist utilization balanced, response time <2min
4. **Execute**: Build query classification → specialist routing with confidence thresholds

**What novice misses**:
- Designs central coordinator that decomposes every query
- Doesn't simulate queue dynamics under load
- Optimizes for perfect routing rather than fast satisficing

**What expert catches**:
- Recognizes coordination through shared mental models vs. communication
- Builds in expectancy monitoring (routing accuracy, load balance)
- Accepts some misroutes to avoid bottleneck

## Quality Gates

- [ ] Situation assessment completes before action generation (pattern recognition first)
- [ ] Mental simulation includes obstacle detection and adaptation capability
- [ ] Expectancy violations trigger immediate pattern reassessment
- [ ] Time-critical situations default to satisficing without option comparison
- [ ] Novel situation detection switches to analytical mode (confidence <30%)
- [ ] Pattern library includes cues, expectancies, goals, actions, and causal factors
- [ ] Coordination relies on shared mental models, not central communication
- [ ] Training uses varied case exposure rather than procedural scripts
- [ ] Decision speed matches problem growth dynamics (exponential problems get fast decisions)
- [ ] System can execute single-option evaluation through forward projection

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- **Optimization problems with stable conditions** → Use formal decision analysis instead
- **Well-defined problems with clear alternatives** → Use multi-criteria decision making instead
- **Statistical/mathematical decisions** → Use quantitative analysis instead
- **Legal/compliance decisions requiring justification** → Use audit-trail decision processes instead

**Delegate to other skills when**:
- **Novel situations with low time pressure** → Use analytical problem-solving frameworks
- **Coordination requiring legal/audit trails** → Use formal project management methods
- **Decisions requiring stakeholder buy-in** → Use collaborative decision-making processes
- **Technical optimization with measurable parameters** → Use engineering optimization methods

**Clear boundaries**:
- Klein's NDM applies to experience-rich domains where patterns exist
- Formal tools work better for abstract problems without experiential patterns
- Use NDM for situation assessment; may still need formal tools for novel action generation
- Pattern-based decisions require sufficient experience base; novices need structured approaches