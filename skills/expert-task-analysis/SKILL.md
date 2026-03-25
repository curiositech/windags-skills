---
license: Apache-2.0
name: expert-task-analysis
description: Analytical methods for decomposing expert performance into cognitive and physical task components
category: Cognitive Science & Decision Making
tags:
  - task-analysis
  - expertise
  - methodology
  - cognitive-science
  - decomposition
---

# SKILL.md — Expert Task Analysis & Agent Capability Design

Frameworks for capturing expert human performance in complex, time-critical domains and translating that expertise into agent systems, training scenarios, or simulation environments. Specializes in the dual-layer structure of skilled performance: explicit procedural knowledge (GOMS) + implicit perceptual knowledge (Critical Cue Inventories).

## Decision Points

### 1. Initial System Design Assessment
```
IF agent/system fails on edge cases but passes normal cases
THEN → Missing art layer: Load critical cue inventory framework
     → Conduct perceptual cue analysis for each decision branch

IF agent decisions are logically correct but poorly timed  
THEN → Impoverished perception: Map environmental signals to decision triggers
     → Build multi-channel sensing architecture

IF system cascades unexpectedly from single failures
THEN → Missing redundancy mapping: Identify all information channels
     → Design backup sensing for each critical decision input
```

### 2. Task Decomposition Strategy Selection
```
IF task has <3 decision branches total
THEN → Use simple GOMS decomposition: Goals→Methods→Operators→Selection rules

IF task has 3-10 decision branches with environmental dependencies  
THEN → Use hierarchical GOMS with Critical Cue Inventories
     → Map each selection rule to specific perceptual cues

IF task has >10 decision branches or continuous adaptation required
THEN → Use situation awareness architecture with predict-compare-adjust loops
     → Build dynamic environmental state model
```

### 3. Expert Interview Protocol Selection
```
IF expert says "I just know" or "it's obvious" at decision points
THEN → Use Critical Decision Method (CDM) probing
     → Probe: "What do you see/hear/feel right before that decision?"

IF expert provides clear procedural explanations
THEN → Assume 50% completeness: Science layer captured, art layer missing
     → Validate with second expert to reveal systematic omissions

IF multiple experts disagree on procedure  
THEN → Document both methods: Disagreement IS the selection rule
     → Map environmental conditions that trigger each expert's method
```

### 4. Simulation Fidelity Requirements
```
IF simulation training transfers poorly to real deployment
THEN → Wrong fidelity focus: Rendering procedures instead of cues
     → Include only environmental details that appear in Critical Cue Inventories

IF simulation handles textbook scenarios but not edge cases
THEN → Missing failure mode scenarios: Add degraded conditions
     → Stress perceptual cues, not just logical procedures

IF simulation feedback is delayed or abstracted
THEN → Real-time cue-action pairing broken: Redesign immediate feedback loops
```

### 5. Agent Architecture Selection  
```
IF agent needs predictive capabilities (anticipate, not just react)
THEN → Implement continuous monitoring goals, not just sequential tasks
     → Build command-predict-observe-compare-adjust loops

IF agent operates in degraded conditions (noise, partial information)  
THEN → Design multi-channel perception with graceful degradation
     → No single points of perceptual failure

IF agent must handle novel situations within domain expertise
THEN → Capture pattern recognition, not just rule following
     → Build situational cue libraries for pattern matching
```

## Failure Modes

### 1. **Science-Only Implementation**
**Detection**: System works on textbook cases, fails when reality diverges from script
**Diagnosis**: Captured explicit procedures but missed implicit perceptual knowledge
**Fix**: Conduct Critical Cue Inventory for each decision branch; map environmental signals to selection rules

### 2. **Single Expert Validation Gap**  
**Detection**: First expert's model seems complete but validation reveals systematic omissions
**Diagnosis**: Expert automaticity conceals habitual tools/context-setup behaviors
**Fix**: Multi-expert validation protocol; specifically probe for "obvious" setup steps and tool usage

### 3. **Sequential-Only Orchestration**
**Detection**: Agent can only react to events, never anticipates; no situational awareness
**Diagnosis**: Modeled all goals as sequential nodes; missing continuous monitoring loops  
**Fix**: Identify recurring goals (assessment, monitoring); implement loop architecture for ongoing state awareness

### 4. **Procedure-Centric Simulation**
**Detection**: Training in simulation doesn't transfer to real deployment performance
**Diagnosis**: Simulated logical steps without perceptual decision triggers
**Fix**: Map Critical Cue Inventory to simulation elements; render cues that trigger decisions, not just visual realism

### 5. **Post-Incident Failure Classification**
**Detection**: Cascading failures from unclassified edge cases; reactive rather than proactive failure handling
**Diagnosis**: No pre-classification of foreseeable failure modes and response options
**Fix**: Pre-classify failure signatures; implement "Restricted Maneuvering" doctrine with pre-warmed responses

## Worked Example: Ship-Handling Agent Design

### Expert Interview Phase
**SME Statement**: "When approaching the pier, I adjust speed based on conditions"
**CDM Probe**: "What specific signals tell you to adjust speed?"
**Expert Response**: "Wind noise around superstructure changes pitch, wake turbulence pattern around pier pilings, how quickly fixed reference points move relative to ship"

### Task Decomposition  
```
GOAL: Approach pier safely
├── METHOD A: Standard approach [IF wind <15 knots AND clear sight lines]
│   ├── Monitor relative motion cues (visual)
│   ├── Monitor wind sound signature (auditory)  
│   └── Adjust throttle based on convergence rate
└── METHOD B: Controlled approach [IF wind >15 knots OR restricted visibility]
    ├── Use redundant position sensing (radar + visual + pilot input)
    ├── Monitor line tension (tactile feedback through deck vibration)
    └── Engage tugboat assistance [IF available]
```

### Critical Cue Inventory Extract
| Decision Point | Perceptual Cue | Signal Type | What It Indicates |
|---------------|----------------|-------------|-------------------|
| Speed adjustment | Wind pitch change around superstructure | Auditory | Relative wind speed increasing |
| Distance assessment | Wake turbulence pattern at pier pilings | Visual | Proximity to pier structure |
| Final approach timing | Fixed reference point motion rate | Visual | Ground speed and angle |

### Agent Implementation
**Perception Layer**: Multi-channel sensors for visual (camera array), auditory (directional microphones), tactile (vibration sensors)
**Decision Layer**: If relative-motion-rate > threshold AND wind-pitch > baseline → engage Method B
**Action Layer**: Throttle control with tugboat coordination protocol

### Validation Gap Discovery
**Initial Model**: No tugboat usage (expert unconsciously assumed tugboat unavailability)  
**Validation Finding**: All validation experts used tugboats as standard practice
**Fix**: Added tugboat coordination as default method; tugboat-unavailable as exception case

## Quality Gates

- [ ] Each decision branch in task decomposition has explicit selection rules with environmental triggers
- [ ] Critical Cue Inventory completed for all major decision points (what expert sees/hears/feels)
- [ ] Multi-expert validation conducted with systematic probe for "obvious" omitted steps
- [ ] Recurring goals identified and separated from sequential goals in architecture
- [ ] Failure modes pre-classified with detection signatures and response protocols  
- [ ] Agent perception layer has redundant sensing for all critical decision inputs
- [ ] Simulation environment includes only CCI-validated cues (not decorative realism)
- [ ] Selection rules tested against degraded conditions (noise, partial information, time pressure)
- [ ] Expert can recognize their own decision process in final agent/system design
- [ ] System performs comparably to expert on novel scenarios within domain boundaries

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- Simple rule-following tasks with <3 decision branches → Use standard process documentation instead
- Tasks where all decision inputs are discrete/digital → Use decision tree or expert system approaches  
- Creative or open-ended problem solving → Use brainstorming/ideation skills instead
- Tasks where expert performance varies widely across practitioners → Use consensus-building skills first
- Real-time performance optimization → Use system tuning/performance analysis skills instead

**Delegate to other skills when**:
- Building user interfaces → Use UX design skills
- Optimizing computational performance → Use algorithm optimization skills  
- Managing expert interview logistics → Use project management skills
- Statistical validation of agent performance → Use experimental design skills
- Legal/regulatory compliance → Use domain-specific compliance skills

This skill operates specifically in the knowledge elicitation and task modeling phase of intelligent system design, not in implementation, optimization, or deployment phases.