# Failure Modes and Error Variance: Designing Systems That Anticipate Breakdown

## The Central Challenge: Everything That Can Go Wrong, Will

Annett (2004) identifies error variance as a core concern: "The top-down systems approach taken by HTA enables the analyst to identify and deal first with factors generating the largest error variance." This deceptively simple statement contains a profound insight about complex system design.

Error variance is the statistical spread in system performance—sometimes it works perfectly, sometimes it fails catastrophically. That variance comes from somewhere. HTA's contribution is a systematic method for locating sources of error variance and directing mitigation effort toward high-impact sources.

## The Three-Column Error Framework (Original HTA)

Annett et al (1971) proposed analyzing each sub-goal for potential difficulties in the perception-action-feedback cycle:

**I/F column (Input/Feedback)**: Can the operator perceive necessary information? Is feedback adequate to detect success/failure?

**A column (Action)**: Can the operator perform required actions? Are controls accessible and understandable?

The questions they proposed:
- "Can the operator detect when to act?"
- "Can the operator determine what action is needed?"
- "Can the operator perform the action?"
- "Can the operator tell if the action succeeded?"

These simple questions reveal potential error sources. If answer is "no" or "sometimes" or "with difficulty," you've found error variance.

Example (operating a nuclear reactor):
- Sub-goal: "Detect pressure anomaly"
- I/F difficulty: Pressure gauge in peripheral vision, easy to miss → High error probability
- A difficulty: None, purely perceptual task
- Implication: Redesign to make anomaly salient (alarm, central display, predictive warning)

## SHERPA: Systematic Error Taxonomy

Stanton extended HTA with Systematic Human Error Reduction and Prediction Approach (SHERPA). The innovation: each task type has associated error modes:

### Action Errors (A1-A10)
- A1: Operation too long/short
- A2: Operation mistimed
- A3: Operation in wrong direction
- A4: Operation too much/too little
- A5: Misalign
- A6: Right operation on wrong object
- A7: Wrong operation on right object
- A8: Operation omitted
- A9: Operation incomplete
- A10: Wrong operation on wrong object

### Retrieval Errors (R1-R3)
- R1: Information not obtained
- R2: Wrong information obtained  
- R3: Information retrieval incomplete

### Checking Errors (C1-C6)
- C1: Check omitted
- C2: Check incomplete
- C3: Right check on wrong object
- C4: Wrong check on right object
- C5: Check mistimed
- C6: Wrong check on wrong object

### Communication Errors (I1-I3)
- I1: Information not communicated
- I2: Wrong information communicated
- I3: Information communication incomplete

### Selection Errors (S1-S2)
- S1: Selection omitted
- S2: Wrong selection made

The taxonomy systematizes error prediction. For each sub-goal:
1. Classify task type (Action/Retrieval/Checking/Communication/Selection)
2. Consider all error modes for that type
3. Judge which are credible (possible given system design and context)
4. Estimate probability (H/M/L) and criticality (H/M/L)
5. Assess recovery possibility
6. Propose remediation

### Example: VCR Programming Analysis

From Stanton (2003), sub-goal "4.3 Set start time":

**Task type**: Information entry (I)

**Credible errors**:
- I1: No time entered → Consequence: No programme recorded → P: Low, C: High → Recovery: None
- I2: Wrong time entered → Consequence: Wrong programme recorded → P: Low, C: High → Recovery: None

**Remediation**: Replace keypad time entry with analogue clock dial interface. Makes time selection visual and immediate rather than abstract and error-prone.

Notice the analytical chain:
1. Goal hierarchy identifies "set start time" as necessary sub-goal
2. SHERPA identifies credible error modes (I1, I2)
3. Probability/criticality analysis shows both are unacceptable (low P but high C)
4. Recovery analysis shows no automatic recovery
5. Design implication: Change interface modality to reduce error probability

This is systematic, not intuitive. You're not guessing what might go wrong; you're working through a taxonomy of known error types.

## The Error Cascade Problem

Hellier et al (2001) analyzed chemical analysis procedures and found that errors cascade through goal hierarchies. An error in "calibrate instrument" (bottom level) propagates to "measure sample concentration" (middle level) propagates to "determine treatment requirement" (top level).

The hierarchy reveals three cascade patterns:

### 1. Amplification
Bottom-level error has magnified impact at higher levels.

Example: 
- Error: Misread scale by 10% (low consequence at task level)
- Propagation: Incorrect concentration → wrong treatment dose (high consequence at system level)

### 2. Accumulation
Multiple independent low-probability errors combine to create high-probability failure.

Example:
- Error A: Forgot to check temperature (P=0.05)
- Error B: Used wrong reagent (P=0.05)  
- Error C: Miscalculated dilution (P=0.05)
- Combined: At least one error occurs with P = 1-(0.95)³ = 0.14 (much higher)

### 3. Critical path
Single error in critical sub-goal causes complete super-ordinate failure.

Example:
- Sub-goal "Secure chemical spill area" is critical for super-ordinate "Respond to incident"
- If securing fails, entire response fails regardless of how well other sub-goals execute
- Critical path sub-goals deserve disproportionate error mitigation effort

The hierarchy makes these patterns visible. Flat task lists hide error propagation. Hierarchical representation shows impact.

## Recovery Analysis: What Happens After Error?

For each identified error, SHERPA asks: "What recovery is possible?"

**Immediate recovery**: Error detectable and correctable without leaving current sub-goal
- Example: "Press wrong button → Immediate visual feedback → Press correct button"

**Subsequent recovery**: Error detectable at later sub-goal; can backtrack and correct
- Example: "Set wrong recording time → Notice during confirmation step → Return to time-setting"

**No recovery**: Error undetectable or uncorrectable within task; requires external intervention
- Example: "VCR clock wrong → Recording fails → Must reprogram and re-record"

Recovery possibilities determine criticality. High-P/high-C errors with no recovery are design disasters. High-P/high-C errors with immediate recovery are manageable.

Design for recovery:
- **Visibility**: Make errors obvious when they occur
- **Reversibility**: Allow undo/redo operations
- **Confirmation**: Require explicit confirmation for high-consequence actions
- **Checkpoints**: Insert verification steps before commitment points

## The Six Design Strategies from Error Analysis

Kirwan & Ainsworth (1992) synthesize error analysis into design strategies:

### 1. Error Prevention
Make the error impossible.
- Example: Mechanical interlocks prevent inserting cassette backward
- Agent system: Type systems prevent invalid function calls

### 2. Error Reduction  
Make the error unlikely.
- Example: Defaults to sensible values reduce wrong-input errors
- Agent system: Pre-validation of inputs before skill invocation

### 3. Error Detection
Make the error visible when it occurs.
- Example: "Check engine" light signals malfunction
- Agent system: Assertions and invariant checking during execution

### 4. Error Recovery
Make correction easy after detection.
- Example: "Undo" button reverses action
- Agent system: Transaction rollback, state snapshots

### 5. Error Tolerance
Make system function despite error.
- Example: Redundant sensors continue operation if one fails
- Agent system: Fallback skills, graceful degradation

### 6. Error Containment
Prevent error propagation to other sub-goals.
- Example: Circuit breakers isolate electrical faults
- Agent system: Exception boundaries, failure isolation

For each sub-goal with high P×C error modes, apply strategies in order. Prevention is best but not always possible. Containment is last resort but essential for system resilience.

## Error Prediction vs. Error Discovery: Two Complementary Approaches

SHERPA is predictive: identify potential errors before system operation. This enables design-time mitigation.

But prediction has limits. Novel systems, complex interactions, and rare edge cases may have unpredictable errors.

Hellier et al (2001) used HTA for error discovery: observe actual system operation, note errors, trace to sub-goals. This enables operational-time learning.

Combined approach:
1. **Design phase**: Use SHERPA to predict credible errors, design mitigations
2. **Operation phase**: Observe and document actual errors  
3. **Refinement phase**: Update error taxonomy with discovered errors, improve mitigations
4. **Iteration**: Feed operational experience back to design for next version

The goal hierarchy provides stable framework for accumulating error knowledge across design-operation cycles.

## Team Errors: Coordination Failure Modes

Annett et al (2000) extend error analysis to team tasks. New error modes emerge:

**Communication errors**:
- Information not sent when needed
- Information sent but not received
- Information received but misunderstood
- Information delayed beyond usefulness

**Coordination errors**:
- Agents work on wrong sub-goals (misaligned priorities)
- Agents duplicate effort (lack of awareness)
- Agents create conflicting outputs (lack of synchronization)
- Agents fail to hand off (dropped responsibility)

Example (emergency response):
- Sub-goal: Police officer reports hazard to control
- Communication error I1: Officer fails to report → Control doesn't dispatch fire service → Hazard uncontained
- Coordination error: Fire service dispatched but police haven't secured scene → Fire service enters unsafe area

Team error analysis requires understanding sub-goal ownership and information dependencies. HTA's team extension (see section 5 of source) makes these explicit in tabular format.

For multi-agent systems:
- Which agent owns each sub-goal?
- What information must flow between agents?
- What synchronization points exist?
- What happens if communication fails?

## The P×C Rule Revisited: Error Variance Edition

The stopping rule (P×C) is really an error variance rule. Continue decomposition where error variance is unacceptably high.

High error variance = High P (uncertainty about success) × High C (impact when failure occurs)

The top-down approach means you identify highest-variance components first:
- At top level: Which super-ordinate goals have highest error variance?
- At next level: Which sub-goals contribute most to that variance?
- Continue until you identify error sources at operational level

Then mitigate highest-variance sources first. Classic Pareto principle: 80% of error variance likely comes from 20% of sub-goals. Find that 20%, fix it.

For agent orchestration:
- Which skills have highest failure rates? (High P)
- Which skill failures have worst cascading effects? (High C)  
- Prioritize improving those skills or adding verification/recovery

## Failure Mode Effects Analysis (FMEA) Integration

HTA naturally supports FMEA:
- **Failure mode**: Error type from taxonomy (A1-A10, R1-R3, etc.)
- **Failure effect**: Consequence on super-ordinate goal
- **Failure probability**: Estimate of P
- **Failure severity**: Estimate of C
- **Risk Priority Number**: P × C (or more complex formula)

The hierarchy provides structure for tracing effects. Bottom-level failure modes propagate to middle-level failure effects propagate to top-level system impacts.

Standard FMEA asks: "How can this component fail?" HTA asks: "How can this sub-goal fail to be achieved?" The framing is goal-oriented rather than component-oriented, which better captures functional failures.

## Design Implications: The Error-Aware System

Error analysis transforms from retrospective ("what went wrong") to prospective ("what could go wrong") to design-oriented ("how do we prevent/detect/recover").

The error-aware system:
1. **Knows its failure modes**: Error taxonomy for each sub-goal
2. **Monitors for errors**: Instrumentation detects anomalies
3. **Recovers gracefully**: Fallback strategies for predicted errors
4. **Learns from failures**: Operational errors update predictions
5. **Degrades safely**: Unpredicted errors contained, don't cascade

For intelligent agents, this means:
- **Every skill has error modes defined**: Not just "might fail" but "fails in these specific ways"
- **Orchestrator monitors execution**: Detects when skill outputs don't match expectations
- **Recovery strategies exist**: Alternative skills, retry logic, escalation to human
- **Failure telemetry collected**: Which skills fail, under what conditions, with what consequences
- **Adaptation over time**: High-error skills get replaced or improved

## Meta-Lesson: Design for Failure, Not Just Success

Traditional task analysis describes nominal operation—what should happen when everything works. HTA's error extensions describe failure modes—what actually happens when things break.

This shift from ideal to real, from normative to descriptive, from success-focused to failure-aware is essential for robust systems.

In multi-agent orchestration:
- Don't just plan the happy path ("agent A calls skill X, result flows to agent B...")
- Plan the failure paths ("if skill X fails, then try skill Y, if both fail, escalate to human")
- Design error detection into the execution flow
- Provide recovery mechanisms at multiple levels

The goal hierarchy provides the structure. The error taxonomy provides the failure modes. The recovery analysis provides the mitigations. Together they enable systems that anticipate breakdown and respond intelligently rather than catastrophically.

That's the difference between fragile systems that work only when everything goes right and resilient systems that work even when things go wrong. Error variance isn't an unfortunate side effect—it's a design consideration that shapes system architecture.