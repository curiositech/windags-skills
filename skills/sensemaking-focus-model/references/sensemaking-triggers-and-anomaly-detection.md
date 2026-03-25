# Sensemaking Triggers and Anomaly Detection: When Does Deliberate Understanding Begin?

## The Initiation Problem

The FOCUS research makes a critical distinction: most cognition is *not* deliberate sensemaking. Pattern recognition, routine execution, and practiced skills run automatically. Sensemaking is "a deliberate and conscious process" (p. 3) that must be *triggered*—something must signal that automatic processing is inadequate and effortful understanding is needed.

The researchers found: "Sensemaking is often triggered by some anomaly or uncertainty that contradicts our typical expectations or interpretations" (p. 9). But this raises deep questions:

**How do you detect an anomaly without already having expectations?**
**How do you know when automatic processing has failed?**
**What makes something surprising enough to trigger deliberate sensemaking?**

These questions are critical for agent systems: if agents don't recognize when they need to engage in sensemaking, they'll apply routine procedures to non-routine situations—a recipe for brittle failure.

## What Constitutes an Anomaly?

The Data/Frame Model defines anomaly detection as part of the **Questioning the Frame** function: "Inconsistent data: One realizes that the data do not match the frame. Anomaly detection: Detection of a unique circumstance in a situation one normally encounters. Violated expectancies: Frames provide people with expectancies; when they are violated people begin to question the accuracy of the frame" (Table 7, p. 25).

This reveals the circular relationship: **Anomalies are frame-relative.** You cannot detect that something is anomalous without a frame that generates expectations. But sensemaking is needed to select and validate frames.

The solution to this circularity: **Humans always have some frame active, even if implicit or poorly specified.** You're never in a true "blank slate" state. When you encounter a situation, pattern-matching and associative processes rapidly activate potentially relevant frames based on surface features, past experiences, and contextual cues.

An anomaly occurs when: **Data activates conflicting frames, violates expectations of the active frame, or fails to fit any readily available frame.**

### Three Types of Anomaly

**Type 1: Expectation Violation**
Active frame generates specific prediction; observation contradicts prediction.

**Example from bus scenario:** 
Frame: "Reducing armored vehicles but adding guard and UAV surveillance maintains perceived security"
Expectation: "Ridership will drop slightly but remain substantial (50-60 students)"
Observation: "Ridership drops to 10 students"  
Anomaly: Massive violation of expectation triggers questioning

**Type 2: Frame Conflict**
Different frames are simultaneously activated by different data elements, yielding contradictory interpretations.

**Example from Afghan Governor:**
Frame A activated by: "supports current government," "no military background," "no financial support to adversaries"
Frame C activated by: "meeting with adversaries multiple times"
Conflict: Same person cannot be both "pro-U.S." and "anti-U.S."
Anomaly: The conflict itself triggers comparison and questioning

**Type 3: Frame Absence**  
No readily available frame seems to apply; situation feels unfamiliar or incoherent.

**Example from navigation study:**
Expected: "This intersection should have a Starbucks on the corner"  
Observed: "No Starbucks, unfamiliar businesses"
Frame: "I'm on X street" no longer makes sense
Anomaly: Realization "I'm lost"—current frame inadequate

### Gradations of Anomaly Strength

Not all anomalies trigger sensemaking equally:

**Weak Anomalies** (minor perturbations):
- Small expectation violations
- Explainable within current frame with modest adjustment
- Don't challenge core frame structure
- Often appropriately "preserved against" (dismissed as noise)

**Moderate Anomalies** (noticeable but ambiguous):
- Clearer expectation violations  
- Require explanation but multiple explanations possible
- May trigger questioning but not necessarily reframing
- Example: Governor disappears for 2-3 weeks (could be legitimate or suspicious)

**Strong Anomalies** (frame-breaking):
- Massive expectation violations
- Cannot be explained within current frame without distortion
- Multiple data points converge on contradiction
- Force frame comparison or reframing
- Example: Ridership drops from 60-80 to 10 students

The research notes that in navigational sensemaking, "corrupting the frame" occurs through anomalies: "managing corrupted cues and anchors" and "spreading corruption" where one misidentified landmark leads to others (p. 4).

## Detecting Anomalies: Human vs. Agent Mechanisms

### Human Anomaly Detection

Humans detect anomalies through:

**1. Automatic Surprise Detection**
Neurological surprise signals when predictions are violated—this is largely unconscious and immediate. You *feel* surprise before articulating what's surprising.

**2. Pattern Interruption**  
When automatic processing hits an obstacle—can't find next action, expected object isn't where it should be, routine breaks down—this interruption surfaces to conscious attention.

**3. Affective Signals**
Confusion, uncertainty, tension, or "something feels wrong" emotional responses flag that current understanding is inadequate.

**4. Explicit Monitoring**
Deliberate checking: "Is this going as expected?" Experts do this more than novices—they actively monitor for discrepancies.

**5. Social Signals**
Others' reactions ("Why would he do that?!") can alert you that your frame may be wrong.

### Agent Anomaly Detection

For agent systems, anomaly detection must be engineered:

**Mechanism 1: Expectation-Matching**

```python
class Frame:
    def generate_expectations(self, context):
        """Frame generates specific predictions given context"""
        return [
            Expectation("ridership will be 50-60 students", confidence=0.7),
            Expectation("bus drivers will be satisfied", confidence=0.6),
            # ...
        ]

def detect_anomalies(frame, observations):
    expectations = frame.generate_expectations(context)
    anomalies = []
    
    for exp in expectations:
        matching_obs = find_matching_observation(exp, observations)
        if matching_obs and contradicts(exp, matching_obs):
            severity = compute_violation_severity(exp, matching_obs)
            anomalies.append({
                'expectation': exp,
                'observation': matching_obs,
                'severity': severity
            })
    
    return anomalies
```

**Mechanism 2: Confidence Degradation**

```python
def monitor_confidence_trajectory(frame, data_sequence):
    """Track whether frame confidence is increasing or decreasing as data arrives"""
    confidence_history = []
    
    for data_point in data_sequence:
        updated_frame = update_frame_with_data(frame, data_point)
        confidence_history.append(updated_frame.confidence)
    
    # Anomaly if confidence drops significantly
    if confidence_history[-1] < confidence_history[0] - THRESHOLD:
        return Anomaly("Frame confidence degrading over time")
    
    # Anomaly if confidence oscillates wildly  
    if variance(confidence_history) > THRESHOLD:
        return Anomaly("Frame confidence unstable")
```

**Mechanism 3: Frame Competition**

```python
def detect_frame_competition(candidate_frames, data):
    """Multiple frames with similar confidence suggests ambiguous situation"""
    
    scores = [score_frame(frame, data) for frame in candidate_frames]
    
    # If multiple frames score similarly, we have unresolved ambiguity
    top_scores = sorted(scores, reverse=True)[:2]
    
    if top_scores[0] - top_scores[1] < DISCRIMINATION_THRESHOLD:
        return Anomaly("Multiple competing frames, cannot discriminate")
```

**Mechanism 4: Preservation Rate Monitoring**

```python
def monitor_preservation_rate(frame, data_history):
    """If frame is constantly explaining away data, it may be wrong"""
    
    contradictions_count = 0
    preserved_count = 0
    
    for data in data_history:
        if contradicts(frame, data):
            contradictions_count += 1
            if frame.explained_away(data):
                preserved_count += 1
    
    preservation_rate = preserved_count / contradictions_count if contradictions_count > 0 else 0
    
    if preservation_rate > THRESHOLD:  # e.g., 0.6
        return Anomaly("Frame being excessively preserved against contradictions")
```

**Mechanism 5: Downstream Failure Detection**

```python
def detect_decision_failures(decisions_based_on_frame):
    """If actions based on frame keep failing, frame may be wrong"""
    
    failure_rate = compute_failure_rate(decisions_based_on_frame)
    
    if failure_rate > THRESHOLD:
        return Anomaly("Decisions based on this frame repeatedly failing")
```

## What To Do When Anomaly Detected

Once an anomaly is detected, the model prescribes several possible responses:

### Response 1: Question the Frame (Moderate Anomaly)

Enter **Questioning** mode:
- Examine whether frame assumptions still hold
- Check data quality (could the anomaly be bad data?)
- Identify what would need to be true for both frame and data to be correct
- Generate questions that would resolve the contradiction

Example: Governor disappears for 2-3 weeks
- Question: "Is extended absence actually anomalous in this context?"
- Investigation: "Has he done this before?"  
- Result: Learning that extended absences are not uncommon → no frame change needed

### Response 2: Compare Frames (Strong Anomaly)

Enter **Comparison** mode:
- Retrieve or generate alternative frames
- Evaluate which frame better explains the data including the anomaly
- Seek discriminating evidence
- May result in switching to alternative frame

Example: Ridership drops from 60-80 to 10 students
- Alternative frames: Students fear violence / Parents restrict students / Bus drivers sabotaging
- Discriminating evidence: Interview students about decision process
- Result: Discovery that parents are decision-makers → reframe

### Response 3: Preserve the Frame (Weak Anomaly or High Confidence Frame)

Enter **Preserving** mode:
- Explain why anomaly is compatible with frame after all
- Discount anomaly as noise, outlier, or measurement error
- Adjust frame slightly to accommodate without major restructuring

Example: Minor ridership fluctuation
- Explanation: "Exams this week, so some students stayed home"
- Frame adjustment: "Expected ridership varies with academic calendar"
- No major frame change

**Critical:** This response is appropriate for genuinely minor anomalies, but becomes pathological fixation if applied to major anomalies.

### Response 4: Reframe (Overwhelming Anomaly)

Enter **Reframing** mode:
- Discard current frame
- Establish new anchors from data previously discarded or reinterpreted  
- Construct entirely new frame
- Recover previously discarded data that now has relevance

Example: Navigation case (from Year 1)
- Realize "I'm not on X Street at all, I'm on Y Street"
- Reinterpret landmarks: "That wasn't the Starbucks I thought, it's a different Starbucks"
- Construct new location frame from scratch

### Response 5: Seek a Frame (No Frame Available)

Enter **Seeking** mode:
- Situation is so novel no frame readily applies  
- Search memory for partially-matching patterns
- Build new frame from fragmentary mental models
- Identify anchors in the data and construct frame around them

Example: Entirely new system architecture or domain
- No existing frame for "How does this specific microservices mesh work?"
- Must build understanding from first principles and fragments  
- Identify key components as anchors and infer relationships

## Engineering Anomaly Sensitivity in Agents

A key challenge: agents must be neither too sensitive (constant false alarms, treating noise as anomalies) nor too insensitive (missing critical signals, fixating on wrong frames).

### Pattern 1: Adaptive Thresholds

Anomaly detection thresholds should adapt to:

**Domain Stability:**
- Stable, well-understood domains → higher thresholds (don't trigger on minor anomalies)
- Dynamic, novel domains → lower thresholds (be more sensitive to unexpected patterns)

**Stakes:**
- High-stakes decisions → lower thresholds (better to over-detect and investigate)
- Low-stakes routine → higher thresholds (false alarms are costlier than missing minor anomalies)

**Confidence:**
- High frame confidence → higher thresholds (take more to dislodge strong frame)
- Low frame confidence → lower thresholds (already uncertain, easy to trigger reexamination)

```python
def compute_anomaly_threshold(domain, stakes, frame_confidence):
    base_threshold = DEFAULT_ANOMALY_THRESHOLD
    
    if domain.stability < 0.5:  # Novel/unstable domain
        base_threshold *= 0.7  # More sensitive
    
    if stakes == HIGH:
        base_threshold *= 0.8  # More sensitive
    
    if frame_confidence < 0.6:
        base_threshold *= 0.9  # More sensitive
    
    return base_threshold
```

### Pattern 2: Multi-Signal Anomaly Detection

Don't rely on single signal. Anomalies are more credible when multiple indicators converge:

```python
def aggregate_anomaly_signals(frame, observations, context):
    signals = []
    
    # Signal 1: Expectation violations
    if expectation_violated(frame, observations):
        signals.append(('expectation_violation', severity_1))
    
    # Signal 2: Confidence degradation
    if confidence_decreasing(frame, observations):
        signals.append(('confidence_drop', severity_2))
    
    # Signal 3: Preservation rate
    if excessive_preservation(frame):
        signals.append(('over_preservation', severity_3))
    
    # Signal 4: Stakeholder disagreement  
    if other_agents_disagree(frame):
        signals.append(('disagreement', severity_4))
    
    # Signal 5: Downstream failures
    if decisions_failing(frame):
        signals.append(('decision_failure', severity_5))
    
    # Aggregate: anomaly is credible if multiple signals fire
    total_severity = sum(s[1] for s in signals)
    
    if len(signals) >= 2 and total_severity > THRESHOLD:
        return Anomaly(signals, total_severity)
```

### Pattern 3: Staged Anomaly Response

Don't immediately jump to reframing on first anomaly. Escalate response based on anomaly persistence:

```
Level 0: No anomaly → Continue elaborating frame
Level 1: Weak anomaly → Log it, continue monitoring
Level 2: Moderate anomaly → Question frame (investigate)  
Level 3: Strong anomaly → Compare alternative frames
Level 4: Overwhelming anomaly → Reframe entirely
```

```python
class AnomalyTracker:
    def __init__(self):
        self.anomaly_history = []
        
    def register_anomaly(self, anomaly):
        self.anomaly_history.append(anomaly)
        
    def recommend_response(self):
        recent = self.anomaly_history[-WINDOW:]  # Last N anomalies
        
        if len(recent) == 0:
            return "CONTINUE_ELABORATING"
        
        severity = max(a.severity for a in recent)
        frequency = len(recent)
        
        if severity < 0.3:
            return "LOG_AND_MONITOR"  
        elif severity < 0.6 and frequency < 3:
            return "QUESTION_FRAME"
        elif severity < 0.8 or frequency >= 3:
            return "COMPARE_FRAMES"
        else:
            return "REFRAME"
```

## Expert vs. Novice Anomaly Detection

The research suggests experts differ in anomaly detection:

**1. Experts Generate Richer Expectations**
More elaborated frames → more specific predictions → easier to detect violations

**2. Experts Monitor More Actively**
Deliberate checking: "Is this consistent with my understanding?" rather than passively waiting for surprise

**3. Experts Question Evidence Quality**
Before treating data as anomalous, check if data itself is anomalous (bad source, measurement error)

Example: "Experts were more likely to question the quality of the data, while novices tended to take them at face value" (p. 3)

In Experiment 2a, "Questioning of negative evidence did depend on experience level, with field experienced participants (77%) questioning significantly more than laypeople (45%)" (p. 19).

**4. Experts Detect Patterns in Anomalies**
Not just "this is weird" but "this type of weirdness suggests X underlying issue"

**5. Experts Calibrate Anomaly Seriousness**
Better at distinguishing minor noise from major frame-breaking events

### Training Anomaly Detection

**Exercise 1: Expectation Generation**
- Present scenario with active frame
- Require: "What specific events would you expect to see? What would be surprising?"
- Practice making frame expectations explicit (prerequisite for anomaly detection)

**Exercise 2: Anomaly Classification**
- Present scenario with various contradictory data points
- Require: "Classify each as: minor noise, moderate anomaly, major anomaly"
- Compare to expert classifications  
- Discuss: What makes an anomaly serious vs. dismissible?

**Exercise 3: Response Selection**
- Present anomaly of varying severity
- Require: "Should you preserve, question, compare, or reframe?"
- Practice matching response to anomaly type

**Exercise 4: False Alarm Analysis**
- Present cases where apparent anomalies were actually bad data
- Practice: Check data quality before concluding frame is wrong

## Anomaly Detection in Multi-Agent Systems

In orchestrated agent systems, anomaly detection can be distributed:

**Pattern 1: Specialist Anomaly Detectors**
Some agents specialize in monitoring for anomalies in specific dimensions:
- Performance anomaly detector (unexpected latency, failures)
- Security anomaly detector (unusual access patterns)
- Data quality anomaly detector (suspicious inputs, outliers)

**Pattern 2: Cross-Agent Disagreement as Anomaly Signal**
When multiple agents assessing the same situation produce different frames:
```python
def detect_frame_disagreement(agents, situation):
    frames = [agent.assess_situation(situation) for agent in agents]
    
    if len(set(frames)) > 1:  # Agents disagree on situation type
        return Anomaly("Cross-agent frame disagreement")
```

**Pattern 3: Hierarchical Anomaly Escalation**
Low-level agents detect local anomalies; if unresolved, escalate to higher-level sensemaking:
```
Code Agent detects: "This function behavior doesn't match specification"
  → If cannot resolve locally, escalate to Architecture Agent
Architecture Agent detects: "This component interaction doesn't match design"
  → If cannot resolve, escalate to System Understanding Agent  
```

**Pattern 4: Monitoring Loops**
Dedicated monitoring agents watch for decision failures:
```python
class DecisionMonitor:
    def observe_decision_outcome(self, decision, outcome):
        if outcome.failed():
            # Decision failed → frame that generated it may be wrong
            triggering_frame = decision.source_frame
            anomaly = Anomaly(f"Decision based on {triggering_frame} failed")
            request_frame_reexamination(triggering_frame, anomaly)
```

## Boundary Conditions: When Anomaly Detection Doesn't Apply

Anomaly detection presumes:
- **Expectations exist**: You have a frame generating predictions  
- **Observations available**: You receive data to compare against expectations
- **Non-deterministic domain**: There can be unexpected events (in fully deterministic, closed systems, "anomalies" are impossible by definition)

It does not apply to:
- **Initial contact with entirely novel situation**: No frame exists yet to generate expectations; you're in Seeking mode from the start
- **Routine execution of well-validated procedures**: Anomalies should be rare; if frequent, the procedure itself is wrong
- **Formal derivation**: In mathematics or logic, "anomalies" are contradictions indicating errors in reasoning, not surprising observations

## The Deep Pattern: Anomalies as Learning Signals

The most profound insight: anomalies are not merely problems to be solved or failures to be corrected. They are **learning signals**—indicators of where your current understanding is inadequate.

Organizations that suppress anomaly signals (blame people for "exceptions," pressure to explain everything within existing frames) destroy learning. Organizations that welcome anomalies, investigate them seriously, and update understanding accordingly develop expertise.

For agent systems: anomalies should trigger not just immediate frame adjustment but also:
- **Logging** for later analysis: "What patterns exist across anomalies?"
- **FMM extraction**: "What new fragmentary mental model did this anomaly teach us?"
- **Frame library updates**: "Should we add a new frame for this situation-type?"
- **Threshold calibration**: "Are we too sensitive or insensitive to this anomaly type?"

Build agents that treat anomalies as opportunities for learning, not merely obstacles to smooth operation. This is the difference between systems that degrade over time (as the world changes) and systems that improve through experience.

The expert pattern: "I don't understand this yet, and that's important information."