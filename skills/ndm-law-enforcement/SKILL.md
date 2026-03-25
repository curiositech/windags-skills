---
license: Apache-2.0
name: ndm-law-enforcement
description: Application of naturalistic decision-making research to law enforcement expertise and field decisions
category: Cognitive Science & Decision Making
tags:
  - ndm
  - law-enforcement
  - decision-making
  - field-study
  - expertise
---

# Naturalistic Decision Making for High-Stakes Domains

## DECISION POINTS

### Primary Decision Tree: Recognize-and-Act vs Deliberate-and-Compare

```
Is the situation pattern-matchable to prior experience?
├── YES: Generate one plausible action
│   ├── Mental simulation passes → ACT immediately
│   └── Simulation fails → Modify action OR generate next best candidate
└── NO: Is this genuine novelty or pattern library failure?
    ├── Genuine novelty → Deliberate carefully, document for future patterns
    └── Pattern gap → Flag training need, proceed with explicit uncertainty
```

### Time Pressure Assessment

```
Time available vs. cost of error:
├── High time pressure + Low error cost → Act on current best read
├── High time pressure + High error cost → Quick situation assessment, then act
├── Low time pressure + Any error cost → Full situation assessment required
└── Conflicting cues present → ALWAYS invest in situation clarification first
```

### Expertise Level Calibration

```
Agent expertise level assessment:
├── Novice/Advanced Beginner → Strict rule following, no improvisation
├── Competent → Rules apply, exceptions require explicit justification (DANGER ZONE)
└── Proficient/Expert → Pattern recognition reliable, intuition is valid data
```

### Post-Decision Failure Diagnosis

```
Decision failed - where was the breakdown?
├── Wrong situation read → Failure in SITUATION ASSESSMENT
│   └── Review cue interpretation, not action selection
├── Right read, wrong action → Failure in ACTION SELECTION
│   └── Review option generation or mental simulation
├── Acted before understanding → PREMATURE CLOSURE
│   └── Novice/Competent behavior pattern
└── Analyzed past action window → DECISION PARALYSIS
    └── Missing satisficing rules
```

## FAILURE MODES

### 1. Tunnel Vision Syndrome
**Symptom**: Agent fixates on initial interpretation despite contradicting evidence
**Root Cause**: Premature closure - commitment to first plausible story without verification
**Detection Rule**: If agent ignores 3+ cues that contradict primary hypothesis, tunnel vision active
**Fix**: Force hypothesis generation of 2+ alternative explanations before action

### 2. Option Enumeration Paralysis
**Symptom**: Agent generates exhaustive option lists under time pressure
**Root Cause**: Novice pattern mistaken for rigor - treating optimization as always superior to satisficing
**Detection Rule**: If agent spends >30% of available time on option generation vs. situation assessment, paralysis mode active
**Fix**: Implement explicit satisficing thresholds and stop-search rules

### 3. Competent Stage Overconfidence
**Symptom**: Agent breaks rules without situational justification
**Root Cause**: Enough experience to see exceptions, insufficient models to know when rule-breaking is safe
**Detection Rule**: If agent deviates from protocols but cannot articulate situation-specific reasoning, overconfidence active
**Fix**: Require explicit situational model before any rule deviation

### 4. Action-First Assessment
**Symptom**: Agent jumps to response selection before understanding what's happening
**Root Cause**: Confusing speed of action with speed of assessment
**Detection Rule**: If agent selects response before completing "what/why/what-next" situation model, action-first active
**Fix**: Mandatory situation assessment checkpoint before action consideration

### 5. Expertise Misattribution
**Symptom**: System fails because expert self-reports were taken at face value
**Root Cause**: Assuming experts can accurately describe their own decision processes
**Detection Rule**: If knowledge base built from direct interviews without structured elicitation, misattribution likely
**Fix**: Use CDM (Critical Decision Method) structured retrospective interviews

## WORKED EXAMPLES

### Example 1: Ambush Scenario - Expert vs Novice Decision Trees

**Setup**: Officer approaches vehicle during traffic stop. Driver's hands suddenly drop below window line.

**Novice Decision Tree**:
1. Notices hand movement (single cue)
2. Recalls training rule: "Hands not visible = potential threat"
3. Draws weapon immediately
4. **Miss**: No assessment of totality - time of day, passenger behavior, driver's verbal responses
5. **Outcome**: Escalation of non-threatening situation

**Expert Decision Tree**:
1. Notices hand movement (primary cue)
2. **Situation Assessment Phase**:
   - Passenger behavior (calm vs. agitated)
   - Driver verbal responses (compliant vs. evasive)
   - Environmental context (lighting, escape routes, backup proximity)
   - Vehicle contents visible
3. **Pattern Recognition**: "Nervous compliance" vs. "Pre-attack indicators"
4. **Mental Simulation**: "If I draw now, what happens next?"
5. **Action**: Verbal command + tactical positioning (vs. immediate weapon draw)
6. **Continuous Assessment**: Ready to escalate but hasn't committed to single interpretation

**Key Difference**: Expert invests cognitive resources in situation model before action selection. Novice applies rule to single cue.

### Example 2: Hostage Situation - Satisficing vs. Optimization

**Setup**: Armed subject holding hostage, demands negotiation. SWAT has clear shot opportunity.

**Optimization Approach (Failure Mode)**:
- Enumerate all possible interventions
- Analyze probability matrices for each
- Seek additional intelligence to improve analysis
- **Time Cost**: 45+ minutes of analysis
- **Outcome**: Subject escalates during delay, situation deteriorates

**Expert Satisficing Approach**:
- **Quick Assessment**: Subject behavior pattern (calm/agitated), hostage condition, containment status
- **First Viable Option**: Negotiation attempt with sniper backup positioned
- **Stop-Search Rule**: "If negotiation maintains status quo for 10 minutes and subject shows compliance indicators, continue. If escalation indicators appear, transition to tactical solution"
- **Mental Simulation**: "This approach handles the 80% probability scenarios adequately"
- **Time Cost**: 5 minutes to implementation
- **Outcome**: Faster stabilization, preserved options

**Trade-off Recognition**: Expert accepts "good enough" solution quickly rather than pursuing optimal solution slowly. The risk of delay exceeded the benefit of analysis perfection.

## QUALITY GATES

Situation assessment is complete when:

- [ ] Primary story can be articulated: "What is happening here?"
- [ ] Key cues supporting story have been identified (minimum 3)
- [ ] Alternative explanations considered: "What else could this be?"
- [ ] Prediction generated: "What happens next if story is correct?"
- [ ] Contradicting evidence actively sought: "What would prove me wrong?"
- [ ] Time/stakes calibration: "How much certainty does this situation require?"
- [ ] Expert intuition acknowledged: "Does something feel off?"

Action selection is complete when:

- [ ] Response matches situation assessment (not generic protocol)
- [ ] Mental simulation of consequences performed
- [ ] Fallback options identified if primary response fails

Decision implementation is complete when:

- [ ] Monitoring plan active for disconfirming cues
- [ ] Escalation/de-escalation triggers defined
- [ ] Success/failure criteria specified

## NOT-FOR Boundaries

**Do NOT use this skill for**:
- **Routine procedural decisions** → Use standard operating procedures instead
- **Technical/engineering problems** → Use systematic analysis frameworks instead  
- **Novel situations with unlimited time** → Use deliberate problem-solving methods instead
- **Decisions where failure cost is catastrophic** → Use formal risk analysis instead

**When to delegate**:
- **For pure optimization problems** → Use operations research methods
- **For complex system design** → Use systems engineering approaches
- **For policy development** → Use structured policy analysis frameworks
- **For training design** → Use instructional design methodologies

**This skill is specifically for**:
- Time-pressured decisions with incomplete information
- Replicating expert judgment under uncertainty
- Diagnosing decision failures in dynamic environments
- Building agent architectures for high-stakes domains