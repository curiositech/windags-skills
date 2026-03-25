---
license: Apache-2.0
name: sensemaking-focus-model
description: '- **Name**: sensemaking-focus-model'
category: Cognitive Science & Decision Making
tags:
  - sensemaking
  - focus
  - mental-models
  - situation-awareness
  - cognition
---

# SKILL: FOCUS Sensemaking Model

## Core Concept

Build agent reasoning systems that mirror how experts develop situation understanding through continuous frame-data reciprocity, fragmentary mental models, and assumption-challenging questions rather than comprehensive world models or linear information processing.

## Decision Points

### When Agent Encounters Anomaly
```
IF anomaly_count < 2 AND current_frame_confidence > 0.7
  → USE Preserving (explain within current frame)
  → SET anomaly_accumulation_threshold = 3
  → CONTINUE with current frame

ELIF anomaly_count >= 3 OR core_expectation_violated
  → FORCE Comparing function
  → GENERATE alternative frames from FMM library
  → REQUIRE explicit frame comparison before proceeding
  
ELIF anomaly is assumption-critical
  → IMMEDIATELY trigger Questioning
  → EXTRACT assumptions underlying current frame
  → GENERATE assumption-challenging questions
  → IF no satisfactory answer → move to Re-framing
```

### When Building Agent Knowledge Base
```
IF task requires expert-level performance
  → BUILD fragmentary mental models (FMMs):
    - Local cause-effect patterns
    - Cue-pattern associations  
    - Context-dependent rules
    - Domain-specific heuristics
  → AVOID comprehensive world models

ELIF system needs to improve over time
  → SEQUENCE: Knowledge structures first, then metacognition
  → NOT generic "critical thinking" strategies
```

### When Agent Must Generate Questions
```
IF current frame has high confidence
  → EXTRACT core assumptions from frame
  → PRIORITIZE assumption-challenging over information-seeking
  → ASK: "Why would X do Y?" not "What did X do?"

ELIF multiple plausible frames exist
  → GENERATE discriminating questions
  → FOCUS on questions that would invalidate one frame
  → TARGET fundamental relationships, agency, causality
```

## Failure Modes

### 1. **Fixation Through Over-Preservation**
**Detection Rule**: If agent explains away 4+ anomalies without triggering frame comparison
**Symptoms**: 
- Anomaly count climbing while frame confidence stays high
- Increasingly complex explanations for simple contradictions
- Resistance to considering alternative interpretations
**Fix**: Implement hard threshold - after N anomalies, FORCE Comparing function regardless of confidence

### 2. **Comprehensive Model Brittleness** 
**Detection Rule**: If system breaks on edge cases not in training data OR requires complete domain knowledge before functioning
**Symptoms**:
- Analysis paralysis while trying to build complete understanding
- System failure when encountering novel scenarios
- Inability to function with partial information
**Fix**: Decompose into FMM library with just-in-time assembly patterns

### 3. **Sensemaking-Decision Blur**
**Detection Rule**: If agent proposes actions while situation assessment confidence < 0.6
**Symptoms**:
- Action recommendations changing as new data arrives
- Inability to explain "what situation we're in" separately from "what we should do"
- Premature commitment to courses of action
**Fix**: Architectural separation with explicit confidence gate between phases

### 4. **Information-Only Questioning**
**Detection Rule**: If 80%+ of generated questions are "What/Where/When" rather than "Why/Who decides/What if"
**Symptoms**:
- Questions like "What is X?" instead of "Why would X happen?"
- Data-seeking without assumption-challenging
- Missing critical insights about agency and causality
**Fix**: Implement assumption-extraction module before question generation

### 5. **Linear Processing Pipeline**
**Detection Rule**: If system processes data → analysis → conclusion without feedback loops
**Symptoms**:
- Current frame doesn't guide what information to seek next
- New data doesn't trigger frame revision
- No reciprocal relationship between interpretation and observation
**Fix**: Rebuild as continuous loop where frame guides data selection and data challenges frame

## Worked Examples

### Example 1: Intelligence Analysis Anomaly
**Scenario**: Agent analyzing communication patterns notices 40% drop in message volume from Target A
**Initial Frame**: "Target A reducing operational tempo"
**Confidence**: 0.8

**Decision Point Navigation**:
1. **Anomaly Detection**: Drop contradicts recent intelligence about planned operations
2. **Threshold Check**: First major anomaly, frame confidence high → Try Preserving
3. **Preserving Attempt**: "Maybe delayed operations due to weather"
4. **New Anomaly**: Weather data shows clear conditions
5. **Anomaly Count**: Now at 2, still below threshold
6. **Third Anomaly**: Increase in communication from Target B (previously dormant)
7. **Trigger**: anomaly_count = 3 → FORCE Comparing function

**Frame Comparison**:
- Frame A: "Reduced tempo" (explains volume drop, conflicts with weather/B activity)  
- Frame B: "Communication security change" (explains A drop + B increase)
- Frame C: "Target A compromised/offline" (explains all data)

**Expert vs Novice**: Novice would continue explaining anomalies within Frame A. Expert triggers comparison at threshold, generates assumption-challenging questions: "Why would B activate when A reduces?" "Who decides communication protocols?"

### Example 2: System Performance Diagnosis
**Scenario**: Application response time increased 300% overnight
**Initial Frame**: "Database performance degradation"

**FMM Assembly Process**:
- Pattern: "Sudden overnight change" → Check deployment logs first
- Pattern: "3x performance drop" → Usually resource contention or config change
- Pattern: "Database suspected" → Verify with query time metrics

**Questioning Strategy**:
- Information-seeking: "What changed in database?" 
- Assumption-challenging: "Why assume it's database? What if network latency increased?"
- Agency-focused: "Who has access to modify configs overnight?"

**Frame Revision**: Questions reveal recent load balancer configuration change, not database issue. FMM pattern "config change + performance drop" provides new frame.

### Example 3: Market Analysis Under Uncertainty
**Scenario**: Stock showing unusual trading patterns - high volume, price stability
**Multiple Competing Frames**:
- Frame A: "Institutional accumulation" 
- Frame B: "Insider trading before announcement"
- Frame C: "Algorithm testing by trading firm"

**Assumption-Challenging Questions**:
- Frame A assumption: "Institutions want to accumulate quietly" → "Why wouldn't they use dark pools?"
- Frame B assumption: "Insiders have material information" → "Why risk detection with high volume?"  
- Frame C assumption: "Testing requires real market" → "Why not use sandbox environments?"

**Trade-off Documentation**:
- Preserving Frame A: Low cognitive cost, but may miss real insider activity
- Comparing all frames: High cognitive cost, but better anomaly coverage
- Decision: Set 48-hour monitoring period with daily frame reassessment

## Quality Gates

### Sensemaking Phase Completion
- [ ] Current frame explains 80%+ of observed data without forced explanations
- [ ] Anomaly accumulation count < threshold (typically 3)
- [ ] Frame confidence score > 0.6 on established scale
- [ ] At least 2 alternative frames considered and explicitly rejected
- [ ] Core assumptions of current frame identified and documented

### Knowledge Base Adequacy  
- [ ] FMM library contains 50+ local cause-effect patterns for domain
- [ ] Cue-pattern associations validated against expert examples
- [ ] Context-dependent rules specify activation conditions
- [ ] Just-in-time assembly procedures tested on novel scenarios
- [ ] Pattern coverage verified against known expert reasoning traces

### Question Generation Quality
- [ ] 60%+ of questions challenge frame assumptions vs. seek information
- [ ] Questions target agency ("Who decides?"), causality ("Why would X?"), relationships
- [ ] Generated questions would discriminate between competing frames
- [ ] Assumption-extraction module identifies 3+ testable frame dependencies
- [ ] Questions match expert questioning patterns for domain

### System Architecture Validation
- [ ] Explicit separation between sensemaking and decision-making phases  
- [ ] Confidence threshold gate prevents premature action planning
- [ ] Frame-data reciprocity loop implemented with bidirectional updates
- [ ] Anomaly accumulation triggers automatic frame comparison
- [ ] System can operate effectively with incomplete information

### Anti-Pattern Prevention
- [ ] Hard limits prevent excessive anomaly explanation (Preserving fixation)
- [ ] Architectural constraints prevent sensemaking-decision blur
- [ ] FMM approach prevents comprehensive model brittleness
- [ ] Question generation avoids information-only patterns
- [ ] Continuous loops prevent linear processing pipeline

## Not-For Boundaries

**Do NOT use this skill for**:
- **Simple classification tasks** → Use pattern-matching algorithms instead
- **Complete information scenarios** → Use standard decision trees instead  
- **Real-time response systems** → Use fast heuristics, delegate to reaction-systems
- **Well-structured problems** → Use domain-specific optimization instead
- **Single-frame situations** → Use direct reasoning, no frame comparison needed

**Delegate to other skills**:
- **For mathematical optimization** → Use operations-research methods
- **For known problem categories** → Use domain-specific algorithms  
- **For collaborative sensemaking** → Use group decision-making frameworks
- **For time-critical decisions** → Use rapid decision-making protocols
- **For routine monitoring** → Use anomaly detection without frame revision

**Clear boundary markers**:
- If problem has single correct answer discoverable through analysis → Not sensemaking
- If situation is familiar with established procedures → Not sensemaking  
- If speed matters more than understanding → Not sensemaking
- If you need group consensus rather than individual understanding → Use collaborative methods